/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseParts } from "@/toolkit/factories/stateContainer";
import { Key } from "@/toolkit/types";

const getKeyName = <T>(key: Key<T> | string): string => {
  return typeof key === "string" ? key : key.name;
};

export const createListOperations = () => {
  let { data, validateDataType, notifyListeners }: BaseParts = {} as never;

  const init = (options: BaseParts) => {
    data = options.data;
    validateDataType = options.validateDataType;
    notifyListeners = options.notifyListeners;
  };

  const isWriteCommand = (command: string) => {
    return ["set", "push", "unshift", "pop", "shift", "setItem"].includes(
      command
    );
  };

  const listOperation = <T>(
    key: Key<T[]>,
    command:
      | "push"
      | "unshift"
      | "pop"
      | "shift"
      | "slice"
      | "getItem"
      | "setItem"
      | "find"
      | "get"
      | "set",
    ...args: any[]
  ): any => {
    validateDataType(key, "list");
    let dataEntry = data.get(getKeyName(key));

    if (!dataEntry && isWriteCommand(command)) {
      dataEntry = { type: "list", value: [] };
      data.set(getKeyName(key), dataEntry);
    }

    if (!dataEntry) return undefined;

    let list = dataEntry.value;

    const operations: { [key in typeof command]: () => any } = {
      push: () => list.push(...args),
      unshift: () => list.unshift(...args),
      pop: () => list.pop(),
      shift: () => list.shift(),
      slice: () => list.slice(args[0], args[1] + 1),
      getItem: () =>
        args[0] < 0 || args[0] >= list.length ? undefined : list[args[0]],
      setItem: () => {
        if (args[0] >= 0 && args[0] < list.length) {
          list[args[0]] = args[1];
        }
      },
      find: () => list.find(args[0]),
      get: () => [...list],
      set: () => {
        data.set(getKeyName(key), { type: "list", value: args[0] });
        list = args[0];
      },
    };

    const operationFunc = operations[command];
    let result: any;
    if (operationFunc) {
      result = operationFunc();
      if (isWriteCommand(command)) {
        notifyListeners({ command, args: [key, ...args] }, [...list]);
      }
    }

    return result;
  };

  const listPush = <T>(key: Key<T[]>, ...values: T[]): number => {
    return listOperation(key, "push", ...values);
  };

  const listUnshift = <T>(key: Key<T[]>, ...values: T[]): number => {
    return listOperation(key, "unshift", ...values);
  };

  const listPop = <T>(key: Key<T[]>): T | undefined => {
    return listOperation(key, "pop");
  };

  const listShift = <T>(key: Key<T[]>): T | undefined => {
    return listOperation(key, "shift");
  };

  const listSlice = <T>(key: Key<T[]>, start: number, stop: number): T[] => {
    return listOperation(key, "slice", start, stop);
  };

  const listGetItem = <T>(key: Key<T[]>, index: number): T | undefined => {
    return listOperation(key, "getItem", index);
  };

  const listSetItem = <T>(key: Key<T[]>, index: number, value: T): void => {
    listOperation(key, "setItem", index, value);
  };

  const listFind = <T>(
    key: Key<T[]>,
    predicate: (value: T, index: number, array: T[]) => boolean
  ): T | undefined => {
    return listOperation(key, "find", predicate);
  };
  const listIndexOf = <T>(
    key: Key<T[]>,
    value: T,
    fromIndex?: number
  ): number => {
    validateDataType(key, "list");
    const dataEntry = data.get(getKeyName(key));

    if (!dataEntry) return -1;

    const list = dataEntry.value;

    return list.indexOf(value, fromIndex);
  };
  const listFindIndex = <T>(
    key: Key<T[]>,
    predicate: (value: T, index: number, array: T[]) => boolean,
    fromIndex?: number
  ): number => {
    validateDataType(key, "list");
    const dataEntry = data.get(getKeyName(key));

    if (!dataEntry) return -1;

    const list = dataEntry.value;

    return list.findIndex(predicate, fromIndex);
  };

  const listGet = <T>(key: Key<T[]>): T[] | undefined => {
    return listOperation(key, "get");
  };

  const listSet = <T>(key: Key<T[]>, value: T[]): void => {
    listOperation(key, "set", value);
  };

  return {
    init,
    listPush,
    listUnshift,
    listPop,
    listShift,
    listSlice,
    listGetItem,
    listSetItem,
    listFind,
    listIndexOf,
    listFindIndex,
    listGet,
    listSet,
  };
};

export default createListOperations();
