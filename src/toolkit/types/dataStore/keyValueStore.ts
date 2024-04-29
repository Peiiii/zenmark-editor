/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IKeyValueStore<T = any> {
  /**
   * Sets a value for a given key.
   * @param key The key under which to store the value.
   * @param value The value to be stored.
   */
  set(key: string, value: T): Promise<void>;

  /**
   * Retrieves the value for a given key.
   * @param key The key whose value to retrieve.
   * @returns A promise that resolves to the value associated with the key, or undefined if the key does not exist.
   */
  get(key: string): Promise<T | undefined>;

  /**
   * Removes the value associated with a given key.
   * @param key The key whose value to remove.
   */
  remove(key: string): Promise<void>;
}
