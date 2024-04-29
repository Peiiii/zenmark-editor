/* eslint-disable @typescript-eslint/ban-types */

import { ICommunicationChannel } from "@/toolkit/factories/rpc/protocal/communicationChannel";
import { nanoid } from "nanoid";

/* eslint-disable @typescript-eslint/no-explicit-any */
enum RPCErrorCode {
  BadRequest = 400,
  NotFound = 404,
  InternalServerError = 500,
  Unauthorized = 401,
}

interface IRPCError {
  code: RPCErrorCode;
  message: string;
  data?: Record<string, any>;
}

export interface IRPCRequest<T extends any[] = any[]> {
  requestId: string;
  type: RPCEventTypes.Request;
  method: string;
  params: T;
  meta?: {
    authToken?: string;
    [key: string]: any;
  };
}

export interface IRPCResponse<T = any> {
  requestId: string;
  type: RPCEventTypes.Response;
  status: "success" | "error";
  data?: T;
  error?: IRPCError;
}

export enum RPCEventTypes {
  Request = "request",
  Response = "response",
}

type RPCMethod<P extends any[], T> = (...params: P) => Promise<T> | T;

export class RPCServiceProvider {
  private methods: Map<string, Function> = new Map();

  constructor(private channel: ICommunicationChannel) {
    this.channel.onMessage((request: IRPCRequest) => {
      if (request.type === RPCEventTypes.Request) {
        this.handleRequest(request);
      }
    });
  }

  registerMethod<P extends any[], R>(
    methodName: string,
    method: RPCMethod<P, R>
  ) {
    this.methods.set(methodName, method);
  }

  private async handleRequest<T extends any[]>(request: IRPCRequest<T>) {
    const { requestId, method, params, meta } = request;

    // 示例：处理安全令牌
    if (!this.authenticateRequest(meta?.authToken)) {
      this.sendError(requestId, RPCErrorCode.Unauthorized, "Unauthorized");
      return;
    }

    const methodFunction = this.methods.get(method);
    if (!methodFunction) {
      this.sendError(requestId, RPCErrorCode.NotFound, "Method not found");
      return;
    }

    try {
      const result = await methodFunction(...params);
      this.channel.sendMessage<IRPCResponse>({
        requestId,
        status: "success",
        type: RPCEventTypes.Response,
        data: result,
      });
    } catch (error) {
      this.sendError(
        requestId,
        RPCErrorCode.InternalServerError,
        error instanceof Error ? error.message : "Internal server error"
      );
    }
  }

  private sendError(requestId: string, code: RPCErrorCode, message: string) {
    this.channel.sendMessage<IRPCResponse<null>>({
      requestId,
      status: "error",
      type: RPCEventTypes.Response,
      error: { code, message },
    });
  }

  /**
   * not implemented
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected authenticateRequest(authToken?: string): boolean {
    // 示例：根据authToken验证请求的合法性
    return true;
  }
}

export class RPCClient {
  private responseHandlers = new Map<
    string,
    (response: IRPCResponse<any>) => void
  >();

  constructor(private channel: ICommunicationChannel) {
    this.channel.onMessage((response: IRPCResponse<any>) => {
      if (response.type === RPCEventTypes.Response) {
        this.handleResponse(response);
      }
    });
  }

  private handleResponse(response: IRPCResponse<any>) {
    const handler = this.responseHandlers.get(response.requestId);
    if (handler) {
      handler(response);
      this.responseHandlers.delete(response.requestId);
    }
  }

  call<T>(method: string, ...args: any[]): Promise<T> {    
    const requestId = nanoid();
    const request: IRPCRequest = {
      requestId,
      method,
      type: RPCEventTypes.Request,
      params: args,
    };
    return new Promise<T>((resolve, reject) => {
      this.responseHandlers.set(requestId, (response: IRPCResponse<any>) => {
        if (response.status === "success") {
          resolve(response.data as T);
        } else if (response.error) {
          reject(new Error(response.error.message));
        }
      });
      this.channel.sendMessage(request);
    });
  }
}
