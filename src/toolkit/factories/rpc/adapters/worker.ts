import { ICommunicationChannel } from "@/toolkit/factories/rpc/protocal/communicationChannel";

export class WorkerCommunicationChannel implements ICommunicationChannel {
  constructor(private worker: Worker) {}

  sendMessage<T>(message: T): Promise<void> {
    this.worker.postMessage(message);
    return Promise.resolve();
  }

  onMessage<T>(callback: (message: T) => void): void {
    this.worker.onmessage = (event) => {
      callback(event.data);
    };
  }
}
