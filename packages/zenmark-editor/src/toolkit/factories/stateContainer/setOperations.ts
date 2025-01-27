/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseParts } from "@/toolkit/factories/stateContainer";
import { Key } from "@/toolkit/types";

const getKeyName = <T>(key: Key<T> | string): string => {
  return typeof key === "string" ? key : key.name;
};

export const createSetOperations = () => {
  let { data, validateDataType, notifyListeners }: BaseParts = {} as never;

  const init = (options: BaseParts) => {
    data = options.data;
    validateDataType = options.validateDataType;
    notifyListeners = options.notifyListeners;
  };

  const sadd = (key: Key, ...members: any[]): number => {
    validateDataType(key, "set");
    const dataEntry = data.get(getKeyName(key)) || {
      type: "set",
      value: new Set(),
    };
    const set = dataEntry.value;
    members.forEach((member) => set.add(member));
    data.set(getKeyName(key), { type: "set", value: set });
    notifyListeners({ command: "SADD", args: [key, ...members] }, new Set(set));
    return set.size;
  };

  const srem = (key: Key, ...members: any[]): number => {
    validateDataType(key, "set");
    const dataEntry = data.get(getKeyName(key));
    if (!dataEntry) return 0;
    const set = dataEntry.value;
    members.forEach((member) => set.delete(member));
    notifyListeners({ command: "SREM", args: [key, ...members] }, new Set(set));
    if (set.size === 0) {
      data.delete(getKeyName(key));
    }
    return set.size;
  };
  const smembers = (key: Key): any[] => {
    validateDataType(key, "set");
    const dataEntry = data.get(getKeyName(key));
    return dataEntry ? Array.from(dataEntry.value) : [];
  };

  const sismember = (key: Key, member: any): boolean => {
    validateDataType(key, "set");
    const dataEntry = data.get(getKeyName(key));
    return dataEntry ? dataEntry.value.has(member) : false;
  };
  return {
    sadd,
    sismember,
    smembers,
    srem,
    init,
  };
};
