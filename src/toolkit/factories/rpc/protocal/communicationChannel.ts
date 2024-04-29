/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ICommunicationChannel {
  sendMessage<T>(message: T): Promise<void>;
  onMessage<T>(callback: (message: T) => void): void;
}
