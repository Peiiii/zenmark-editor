/* eslint-disable @typescript-eslint/no-explicit-any */
export const createComponentRegistry = () => {
  const registry = new Map<string, React.FC<any>>();

  const register = (name: string, component: React.FC<any>) => {
    registry.set(name, component);
  };

  const get = (name: string) => {
    return registry.get(name);
  };

  return {
    register,
    get,
  };
};
