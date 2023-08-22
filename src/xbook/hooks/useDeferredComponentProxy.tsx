/*
## 函数签名

```typescript
function useDeferredComponentProxy<T extends object>(
  createInstance: (proxy: DeferredProxy<T>) => React.ReactElement,
): DeferredComponentProxy<T>;
```

## 功能

`useDeferredComponentProxy` 是一个用于延迟加载组件的 Hook，它会返回一个代理对象和一个 `ReactElement` 实例。通过代理对象，可以注册组件的方法，并在组件加载后执行这些方法。这样可以避免组件在加载过程中出现阻塞，提高应用的性能。

## 输入参数

- `createInstance`：一个函数，用于创建组件实例。其输入参数为一个代理对象，输出参数为一个 `ReactElement` 实例。

## 输出参数

- `proxy`：一个代理对象，可以用于注册组件的方法，并在组件加载后执行这些方法。
- `instance`：一个 `ReactElement` 实例，表示组件实例。在组件加载完成后，该实例才会被设置为真实的组件实例。
*/
import React, { useCallback, useEffect, useState } from "react";
import { createDeferredProxy } from "xbook/common/deferredProxy";

export type DeferredProxy<T extends Record<string, any>> = T & {
  register: <K extends keyof T>(name: K | Partial<T>, func?: T[K]) => void;
};

interface DeferredComponentProxy<T extends object> {
  proxy: DeferredProxy<T>;
  instance: React.ReactElement;
}
type UseDeferredComponentProxy<T extends object> = [
  DeferredProxy<T>,
  React.ReactElement
];
export function useDeferredComponentProxy<T extends object>(
  createInstance: ({
    proxy,
  }: {
    proxy: DeferredProxy<T>;
  }) => React.ReactElement,
  onRegister?: (name: keyof T, func?: T[keyof T]) => void
): UseDeferredComponentProxy<T> {
  const [proxy, setProxy] = useState(() =>
    createDeferredProxy<T>((name, func) => {
      if (onRegister) {
        onRegister(name, func);
      }
    })
  );
  const [instance, setInstance] = useState<React.ReactElement>();
  const onProxyReady = useCallback((proxy: DeferredProxy<T>) => {
    const CreateInstance = createInstance;
    const instance = <CreateInstance proxy={proxy} />;
    setInstance(instance);
  }, []);

  useEffect(() => {
    onProxyReady(proxy);
  }, [proxy, onProxyReady]);

  return [proxy, instance!];
}

export function createDeferredComponentProxy<T extends object>(
  createInstance: ({
    proxy,
  }: {
    proxy: DeferredProxy<T>;
  }) => React.ReactElement,
  onRegister?: (name: keyof T, func?: T[keyof T]) => void
): DeferredComponentProxy<T> {
  const CreateInstance = createInstance;
  const proxy = createDeferredProxy<T>((name, func) => {
    if (onRegister) {
      onRegister(name, func);
    }
  });
  const instance = <CreateInstance proxy={proxy} />;
  return { proxy, instance: instance! };
}
