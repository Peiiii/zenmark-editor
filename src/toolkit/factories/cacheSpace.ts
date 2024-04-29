/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useLocalStorage as globalUseLocalStorage } from "usehooks-ts";

interface StorageProvider {
  set(key: string, value: any): void;
  get(key: string): any;
  remove(key: string): void;
  [k: string]: any;
}
const LocalStorageStore: StorageProvider = {
  set: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get: (key: string) => {
    const value = localStorage.getItem(key);
    if (value === "undefined") return undefined;
    if (value) return JSON.parse(value);
    else return value;
  },
  remove: (key: string) => {
    return localStorage.removeItem(key);
  },
  useLocalStorage: (key: string, value: any) => {
    return globalUseLocalStorage(key, value);
  },
};
const MemoryStore: StorageProvider = (() => {
  const Cache: Map<string, any> = new Map();
  const set = (key: string, value: any) => {
    Cache.set(key, value);
  };
  const get = (key: string) => {
    return Cache.get(key);
  };
  const remove = (key: string) => {
    return Cache.delete(key);
  };
  return { set, get, remove };
})();

type StorageProviderName = "memory" | "localStorage";
const StorageProviders: { [key in StorageProviderName]: StorageProvider } = {
  memory: MemoryStore,
  localStorage: LocalStorageStore,
};

export const createCacheSpace = (
  prefix: string,
  storage: StorageProviderName = "memory"
) => {
  const store = StorageProviders[storage];
  const set = (
    keyOrData: string | { [k: string]: any },
    value?: any
  ) => {
    const setKeyVal = (key: string, value: any) => {
      key = prefix ? prefix + ":" + key : key;
      store.set(key, value);
    };
    if (typeof keyOrData === "string") {
      const key = keyOrData;
      setKeyVal(key, value);
    } else {
      const data = keyOrData;
      Object.keys(data).forEach((key) => {
        setKeyVal(key, data[key]);
      });
    }
  };

  const useLocalStorage = (key: string, value: any) => {
    key = prefix ? prefix + ":" + key : key;
    return store.useLocalStorage(key, value);
  };

  const remove = (key: string) => {
    key = prefix ? prefix + ":" + key : key;
    return store.remove(key);
  };
  const get = (key: string, defaultValue?: any) => {
    key = prefix ? prefix + ":" + key : key;
    const value = store.get(key);
    return typeof value === "undefined" || value === null
      ? defaultValue
      : value;
  };
  type CacheTransform<T> = {
    in?: (state: T) => T;
    out?: (state: T) => T;
  };
  const useCachedState = <T>(
    key: string,
    defaultValue: any,
    transform: CacheTransform<T> = {}
  ): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [state, setState] = useState<T>(
      transform.out
        ? transform.out(get(key, defaultValue))
        : get(key, defaultValue)
    );
    useEffect(() => {
      if (transform.in) {
        set(key, transform.in(state));
      } else set(key, state);
    }, [key, state, transform]);
    return [state, setState];
  };
  const space = (pre: string, storage: StorageProviderName = "memory") =>
    createCacheSpace(prefix ? prefix + ":" + pre : pre, storage);
  return {
    set,
    get,
    remove,
    space,
    useCachedState,
    useLocalStorage,
  };
};
