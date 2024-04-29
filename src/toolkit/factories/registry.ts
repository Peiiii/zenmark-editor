/* eslint-disable @typescript-eslint/no-explicit-any */
import { BehaviorSubject, Observable, filter, skip } from "rxjs";
import { useEffect, useState } from "react";

type Callback<T> = (value: T) => void;
type CancelFunction = () => void;
interface Registry<T = Record<string, any>> {
  has: (key: keyof T) => boolean;
  get: <K extends keyof T>(key: K) => T[K] | undefined;
  set: <K extends keyof T>(key: K, value: T[K]) => void;
  waitAvailable: <K extends keyof T>(key: K, callback: Callback<T[K]>) => void;
  subscribe: <K extends keyof T>(
    key: K,
    callback: Callback<T[K]>,
    withInitial?: boolean
  ) => CancelFunction;
  useValue: <K extends keyof T>(key: K) => T[K] | undefined;
  getStream: <K extends keyof T>(key: K) => Observable<T[K]>;
}

const Registry = {
  create: <T>(): Registry<T> => {
    const map: {
      [K in keyof T]?: BehaviorSubject<T[K]>;
    } = {};
    // const observers: { key: keyof T; callback: Callback<T[keyof T]> }[] = [];

    const has = (key: keyof T): boolean => {
      return key in map;
    };

    const get = <K extends keyof T>(key: K): T[K] | undefined => {
      return map[key]?.getValue();
    };

    const getStream = <K extends keyof T>(key: K) => {
      if (!map[key]) {
        map[key] = new BehaviorSubject<T[K]>(undefined as never);
      }
      return map[key]!.pipe(filter((v) => v !== undefined));
    };

    const set = <K extends keyof T>(key: K, value: T[K]): void => {
      if (!map[key]) {
        map[key] = new BehaviorSubject(value);
      } else {
        map[key]!.next(value);
      }
    };

    // const notifyObservers = <K extends keyof T>(key: K, value: T[K]): void => {
    //   const filteredObservers = observers.filter(
    //     (observer) => observer.key === key
    //   );
    //   for (const observer of filteredObservers) {
    //     observer.callback(value);
    //   }
    // };

    const subscribe = <K extends keyof T>(
      key: K,
      callback: Callback<T[K]>,
      withInitial?: boolean
    ): CancelFunction => {
      if (!map[key]) {
        map[key] = new BehaviorSubject<T[K]>(undefined as never);
      }
      const sub = withInitial
        ? map[key]!.subscribe(callback)
        : map[key]!.pipe(skip(1)).subscribe(callback);
      return () => sub.unsubscribe();
      // const observer = {
      //   key: key as keyof T,
      //   callback: callback as Callback<T[keyof T]>,
      // };
      // observers.push(observer);

      // return () => {
      //   const index = observers.indexOf(observer);
      //   if (index >= 0) {
      //     observers.splice(index, 1);
      //   }
      // };
    };

    const subscribeOnce = <K extends keyof T>(
      key: K,
      callback: Callback<T[K]>
    ): void => {
      if (!map[key]) {
        map[key] = new BehaviorSubject<T[K]>(undefined as never);
      }
      const sub = map[key]!.subscribe((v) => {
        callback(v);
        sub.unsubscribe();
      });
    };

    // const waitAvailable = <K extends keyof T>(
    //   key: K,
    //   callback: Callback<T[K]>
    // ): void => {
    //   if (has(key)) {
    //     const value = get(key);
    //     callback(value!);
    //   } else {
    //     const observer = {
    //       key: key as keyof T,
    //       callback: (value: T[keyof T]) => {
    //         callback(value as T[K]);
    //         const index = observers.indexOf(observer);
    //         if (index >= 0) {
    //           observers.splice(index, 1);
    //         }
    //       },
    //     };
    //     observers.push(observer);
    //   }
    // };

    // const setWithNotify = <K extends keyof T>(key: K, value: T[K]): void => {
    //   set(key, value);
    //   notifyObservers(key, value);
    // };

    const useValue = <K extends keyof T>(key: K): T[K] | undefined => {
      if (!map[key]) {
        map[key] = new BehaviorSubject<T[K]>(undefined as never);
      }
      const [state, setState] = useState(map[key]!.getValue());

      useEffect(() => {
        map[key]!.pipe(skip(1)).subscribe((v) => setState(v));
      }, [key, setState]);
      return state;
    };

    return {
      has,
      get,
      // set: setWithNotify,
      waitAvailable: subscribeOnce,
      set,
      subscribe,
      useValue,
      getStream,
    };
  },
};

export const createRegistry = <T = Record<string, any>>(): Registry<T> => Registry.create<T>();
