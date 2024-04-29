export type InjectToken<T> = {
  key: string;
  typeHolder: (instance: T) => void;
};

export const createInjectToken = <T>(key: string): InjectToken<T> => ({
  key: key,
  typeHolder: () => {},
});

export const createInjector = () => {
  const map = new Map();
  const provide = <T>(token: InjectToken<T>, getInstance: () => T) => {
    map.set(token.key, getInstance());
  };

  const get = <T>(token: InjectToken<T>): T => {
    return map.get(token.key);
  };

  return {
    provide,
    get,
    createToken: createInjectToken,
  };
};
