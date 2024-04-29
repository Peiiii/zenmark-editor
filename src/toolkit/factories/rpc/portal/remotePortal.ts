/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { SubscriptionManager } from "@/toolkit/factories/rpc/portal/subscriptionManager";
import {
  RPCClient,
  RPCServiceProvider,
} from "@/toolkit/factories/rpc/protocal";
import { ICommunicationChannel } from "@/toolkit/factories/rpc/protocal/communicationChannel";
import { createServiceBus } from "@/toolkit/factories/serviceBus";
import { nanoid } from "nanoid";

export enum RevserServicePointEnum {
  CALL_HOISTED_FUNCTION = "callHoistedFunction",
}

export type AbilityMapping = {
  key: string;
  remoteKey?: string;
  processArguments?: (args: any[]) => any[];
};

export class RemotePortal {
  private objectBank: Map<string, any> = new Map();
  private subscriptionManager = new SubscriptionManager();
  private serviceBus = createServiceBus();
  private rpcClient: RPCClient;
  private rpcServiceProvider: RPCServiceProvider;

  constructor(
    private communicationChannel: ICommunicationChannel,
    private options: Record<string, any> = {}
  ) {
    this.rpcClient = new RPCClient(this.communicationChannel);
    this.rpcServiceProvider = new RPCServiceProvider(this.communicationChannel);
    this.init();
  }

  private init() {
    this.rpcServiceProvider.registerMethod(
      RevserServicePointEnum.CALL_HOISTED_FUNCTION,
      (id: string, ...args: any[]) => {
        const handler = this.objectBank.get(id);
        if (handler) {
          handler(...args);
        }
      }
    );
  }

  remoteCall(key: string, ...args: any[]) {
    this.rpcClient.call(key, ...args);
  }

  mapRemoteAbilities(abilities: (string | AbilityMapping)[]) {
    this.addAbilities(
      abilities.map((item) => {
        if (typeof item === "string") {
          return {
            key: item,
            handler: (...args: any[]) => {
              this.remoteCall(item, ...args);
            },
          };
        }
        return {
          key: item.key,
          handler: (...args: any[]) => {
            this.remoteCall(
              item.remoteKey || item.key,
              ...(item.processArguments ? item.processArguments(args) : args)
            );
          },
        };
      })
    );
  }

  invoke(key: string, ...args: any[]) {
    return this.serviceBus.invoke(key, ...args);
  }

  addAbilities(
    abilities: {
      key: string;
      handler: (...args: any[]) => any;
    }[]
  ) {
    this.serviceBus.expose(
      Object.fromEntries(abilities.map(({ key, handler }) => [key, handler]))
    );
    abilities.forEach(({ key, handler }) => {
      this.rpcServiceProvider.registerMethod(key, handler);
    });
  }

  hoist(obj: any) {
    const id = nanoid();
    this.objectBank.set(id, obj);
    return {
      type: "handle",
      id,
    };
  }
}
