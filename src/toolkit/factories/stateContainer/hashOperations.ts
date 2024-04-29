/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseParts } from "@/toolkit/factories/stateContainer";
import { Key } from "@/toolkit/types";

const getKeyName = <T>(key: Key<T> | string): string => {
  return typeof key === "string" ? key : key.name;
};
export const createHashOperations = () => {
  let { data, validateDataType, notifyListeners }: BaseParts = {} as never;

  const init = (options: BaseParts) => {
    data = options.data;
    validateDataType = options.validateDataType;
    notifyListeners = options.notifyListeners;
  };

  const hset = (key: Key, field: string, value: any): void => {
    validateDataType(key, "hash");
    const dataEntry = data.get(getKeyName(key)) || { type: "hash", value: {} };
    const hash = dataEntry.value;
    hash[field] = value;
    data.set(getKeyName(key), { type: "hash", value: hash });
    notifyListeners(
      { command: "HSET", args: [key, field, value] },
      { ...hash }
    );
  };

  const hget = <T>(key: Key<T>, field: string): T | undefined => {
    validateDataType(key, "hash");
    const dataEntry = data.get(getKeyName(key));
    const hash = dataEntry ? dataEntry.value : {};
    return hash[field];
  };

  const hdel = (key: Key, ...fields: string[]): void => {
    validateDataType(key, "hash");
    const dataEntry = data.get(getKeyName(key));
    if (!dataEntry) return;
    const hash = dataEntry.value;
    fields.forEach((field) => delete hash[field]);
    notifyListeners({ command: "HDEL", args: [key, ...fields] }, { ...hash });
    if (Object.keys(hash).length === 0) {
      data.delete(getKeyName(key));
    }
  };

  const hgetall = <T extends Record<string, any>>(key: Key): T | undefined => {
    validateDataType(key, "hash");
    const dataEntry = data.get(getKeyName(key));
    return dataEntry ? { ...dataEntry.value } : undefined;
  };
  return {
    hdel,
    hget,
    hgetall,
    hset,
    init,
  };
};
