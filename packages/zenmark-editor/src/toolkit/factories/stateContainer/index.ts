import { createHashOperations } from "@/toolkit/factories/stateContainer/hashOperations";
import { createListOperations } from "@/toolkit/factories/stateContainer/listOperations";
import { createSetOperations } from "@/toolkit/factories/stateContainer/setOperations";
import { Key } from "@/toolkit/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
type StateDataType = "single" | "list" | "set" | "hash";

interface StateCommand {
  command: string;
  args: any[];
}

interface StateListener {
  key: Key;
  callback: (command: StateCommand, result: any) => void;
}
const getKeyName = <T>(key: Key<T> | string): string => {
  return typeof key === "string" ? key : key.name;
};

const createBaseContainer = () => {
  const data: Map<string, { type: StateDataType; value: any }> = new Map();
  const listeners: StateListener[] = [];

  const validateDataType = (key: Key, expectedType: StateDataType): void => {
    const dataEntry = data.get(getKeyName(key));
    if (dataEntry && !( dataEntry.type === expectedType)) {
      throw new Error(
        `ERR Operation against a key holding the wrong kind of value`
      );
    }
  };

  const notifyListeners = (command: StateCommand, result?: any): void => {
    listeners.forEach((listener) => {
      if (listener.key === command.args[0]) {
        listener.callback(command, result);
      }
    });
  };

  const set = (key: Key, value: any): void => {
    data.set(getKeyName(key), { type: "single", value });
    notifyListeners({ command: "SET", args: [key, value] }, value);
  };

  const get = <T = any>(key: Key<T>): T | undefined => {
    const dataEntry = data.get(getKeyName(key));
    return dataEntry ? dataEntry.value : undefined;
  };

  const del = (key: Key): void => {
    data.delete(getKeyName(key));
    notifyListeners({ command: "DEL", args: [key] });
  };

  const subscribe = <T>(
    key: Key<T>,
    callback: (command: StateCommand, result: any) => void
  ): (() => void) => {
    const listener: StateListener = { key, callback };
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  };

  const unsubscribe = (
    key: Key,
    callback: (command: StateCommand, result: any) => void
  ): void => {
    const listener: StateListener = { key, callback };
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  };
  const base = {
    set,
    get,
    del,
    subscribe,
    unsubscribe,
  };
  type Base = typeof base;
  type OperationModule = {
    init: (options: BaseParts) => void;
  };
  function equip<O1>(o1: O1): Exclude<O1 & Base, "init">;
  function equip<O1, O2>(o1: O1, o2: O2): Exclude<O1 & O2 & Base, "init">;
  function equip<O1, O2, O3>(
    o1: O1,
    o2: O2,
    o3: O3
  ): Exclude<O1 & O2 & O3 & Base, "init">;
  function equip<O1, O2, O3>(
    ...operationModules: [O1, O2, O3, ...OperationModule[]]
  ): Exclude<
    (typeof operationModules)[0] &
      (typeof operationModules)[1] &
      (typeof operationModules)[2] &
      Record<string, (...args: any[]) => any> &
      Base,
    "init"
  >;
  function equip(...operationModules: OperationModule[]) {
    operationModules.forEach((module) => {
      module.init({
        data,
        validateDataType,
        notifyListeners,
      });
    });

    return Object.assign(base, ...operationModules, { init: undefined });
  }

  // 返回一个包含所有公共方法的对象
  return Object.assign(base, { equip });
};

export type BaseParts = {
  data: Map<string, { type: StateDataType; value: any }>;
  validateDataType: (key: Key, type: StateDataType) => void;
  notifyListeners: (command: StateCommand, result?: any) => void;
};





// 创建状态容器实例
export const createStateContainer = () => {
  const base = createBaseContainer();
  const list = createListOperations();
  const hash = createHashOperations();
  const set = createSetOperations();
  const container = base.equip(list, hash, set);
  return container;
};
