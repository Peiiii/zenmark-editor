type Callback<T extends any[]> = (...args: T) => void;

interface ScopedEventBus {
  on: <T extends any[]>(
    event: string | Record<string, Callback<any>>,
    callback?: Callback<T>
  ) => () => void;
  emit: <T extends any[]>(event: string, ...args: T) => void;
}

interface EventBus extends ScopedEventBus {
  createScopedProxy: (scope: string) => ScopedEventBus;
}

export const createEventBus = (): EventBus => {
  const events = new Map<string, Callback<any>[]>();

  const on = <T extends any[]>(
    event: string | Record<string, Callback<T>>,
    callback?: Callback<T>
  ): (() => void) => {
    if (typeof event === "string") {
      if (!events.has(event)) {
        events.set(event, []);
      }
      const callbacks = events.get(event)!;
      callbacks.push(callback!);
      return () => {
        const index = callbacks.indexOf(callback!);
        if (index !== -1) {
          callbacks.splice(index, 1);
        }
      };
    } else if (typeof event === "object") {
      const listeners: (() => void)[] = [];
      Object.entries(event).forEach(([eventType, eventCallback]) => {
        const listener = on(eventType, eventCallback);
        listeners.push(listener);
      });
      return () => {
        listeners.forEach((listener) => listener());
      };
    } else {
      throw new Error(`Invalid event type: ${event}`);
    }
  };

  const emit = <T extends any[]>(event: string, ...args: T): void => {
    if (events.has(event)) {
      const callbacks = events.get(event)!;
      callbacks.forEach((callback) => {
        callback(...args);
      });
    }
  };

  const createScopedProxy = (scope: string): ScopedEventBus => {
    const scopedOn = <T extends any[]>(
      event: string | Record<string, Callback<T>>,
      callback?: Callback<T>
    ): (() => void) => {
      if (typeof event === "string") {
        return on(`${scope}/${event}`, callback);
      } else {
        const mappedEvent: Record<string, Callback<T>> = {};
        Object.entries(event).forEach(([eventType, eventCallback]) => {
          mappedEvent[`${scope}/${eventType}`] = eventCallback;
        });
        return on(mappedEvent);
      }
    };

    const scopedEmit = <T extends any[]>(event: string, ...args: T): void => {
      emit(`${scope}/${event}`, ...args);
    };

    return { on: scopedOn, emit: scopedEmit };
  };

  return { on, emit, createScopedProxy };
};

// 使用示例
export const eventBus = createEventBus();

// const cancelSubscription = eventBus.on('foo', (arg1: string, arg2: number) => {
//   console.log(arg1, arg2); // 输出：hello 123
// });

// eventBus.emit('foo', 'hello', 123);

// cancelSubscription();
