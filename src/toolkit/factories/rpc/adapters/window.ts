/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  RPCClient,
  RPCServiceProvider,
} from "@/toolkit/factories/rpc/protocal";
import { ICommunicationChannel } from "@/toolkit/factories/rpc/protocal/communicationChannel";

export class WindowCommunicationChannel implements ICommunicationChannel {
  constructor(private targetWindow: Window, private targetOrigin: string) {}

  sendMessage(message: any): Promise<void> {
    // 直接发送消息，不管理响应
    this.targetWindow.postMessage(message, this.targetOrigin);
    return Promise.resolve();
  }

  onMessage(callback: (message: any) => void): void {
    window.addEventListener("message", (event) => {
      if (this.targetOrigin === "*" || event.origin === this.targetOrigin) {
        callback(event.data);
      }
    });
  }
}

export class WindowRPCClient extends RPCClient {
  constructor(private targetWindow: Window) {
    super(new WindowCommunicationChannel(targetWindow, "*"));
  }
}

export class WindowRPCServiceProvider extends RPCServiceProvider {
  constructor(private targetWindow: Window) {
    super(new WindowCommunicationChannel(targetWindow, "*"));
  }
}
