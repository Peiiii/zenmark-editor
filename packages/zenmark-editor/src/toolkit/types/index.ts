// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...args: any[]) => any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyArgs = any[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SafeAny = any;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type TypedKey<T> = {
  name: string;
    typeHolder?: (arg: T) => void;
};

export type ExtractKeyType<T> = T extends TypedKey<infer U> ? U : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Key<T = any> = string | TypedKey<T>;
