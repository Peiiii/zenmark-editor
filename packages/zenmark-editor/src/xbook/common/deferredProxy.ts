export type DeferredProxy<T extends Record<string, any>> = T & {
  register: <K extends keyof T>(name: K | Partial<T>, func?: T[K]) => void;
};

export const createDeferredProxy = <T extends Record<string, any>>(
  onRegister?: (name: keyof T, func?: T[keyof T]) => void
): DeferredProxy<T> => {
  const obj: T = {} as T;
  const taskQueueMap = new Map<keyof T, any[]>();

  const flushTaskQueue = (functionName: keyof T): void => {
    const taskQueue = taskQueueMap.get(functionName);
    if (taskQueue) {
      while (taskQueue.length) {
        const args = taskQueue.shift()!;
        const func = obj[functionName];
        if (func) {
          func(...args);
        }
      }
    }
  };

  const register = <K extends keyof T>(
    name: K | Partial<T>,
    func?: T[K]
  ): void => {
    if (typeof name === "object" && name !== null) {
      for (const key in name) {
        if (Object.prototype.hasOwnProperty.call(name, key)) {
          register(key as unknown as K, name[key] as T[K]);
        }
      }
    } else {
      obj[name] = func!;
      flushTaskQueue(name);
      if (onRegister) {
        onRegister(name, func);
      }
    }
  };

  const proxy = new Proxy(obj, {
    get(target, prop, receiver) {
      if (typeof prop !== "string") {
        return undefined;
      }
      return (...args: any[]) => {
        if (!(prop in target)) {
          const taskQueue = taskQueueMap.get(prop);
          if (!taskQueue) {
            taskQueueMap.set(prop, []);
          }
          taskQueueMap.get(prop)!.push(args);
        } else {
          return (Reflect.get(target, prop, receiver) as any)(...args);
        }
      };
    },
  });

  // 为代理对象增加一个 register 方法，用于注册新的方法
  (proxy as any).register = register;

  return proxy as DeferredProxy<T>;
};
