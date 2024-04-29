import { Disposable } from "@/toolkit/vscode/Disposable";

export class SubscriptionManager {
  private subscriptions: Disposable[] = [];

  dispose() {
    this.subscriptions.forEach((sub) => sub.dispose());
  }

  add(sub: Disposable | (() => void)): Disposable {
    if (sub instanceof Disposable) {
      this.subscriptions.push(sub);
      return sub;
    } else {
      const disposable = new Disposable(sub);
      this.subscriptions.push(disposable);
      return disposable;
    }
  }
}
