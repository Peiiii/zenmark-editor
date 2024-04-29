import { ICommunicationChannel } from "@/toolkit/factories/rpc/protocal/communicationChannel";

export class ServiceWorkerCommunicationChannel
  implements ICommunicationChannel
{
  constructor(private serviceWorkerGlobalScope: ServiceWorkerGlobalScope) {}
  async sendMessage<T>(message: T): Promise<void> {
    const clientList = await this.serviceWorkerGlobalScope.clients.matchAll();
    clientList.forEach((client) => {
      client.postMessage(message);
    });
  }

  onMessage<T>(callback: (message: T) => void): void {
    self.addEventListener("message", (event) => {
      callback(event.data);
    });
  }
}
