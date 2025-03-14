// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SafeAny = any;
export type PluginInitializationConfiguration<
  TOptions extends Record<string, SafeAny>,
  TMethodName extends string,
  TOptionalMethodName extends string,
  TContext
> = {
  id?: string;
  name?: string;
  description?: string;
  addOptions?: () => TOptions;
} & {
  [methdName in TMethodName]: (
    this: {
      id?: string;
      name?: string;
      description?: string;
      options: Partial<TOptions>;
    },
    context: TContext
  ) => void;
} & {
  [methdName in TOptionalMethodName]?: (
    this: {
      id?: string;
      name?: string;
      description?: string;
      options: Partial<TOptions>;
    },
    context: TContext
  ) => void;
};

export const createPluginSystem = <
  TContext,
  TMethodName extends string,
  TOptionalMethodName extends string
>() => {
  type PluginType<TM, TOM, O> = {
    id?: string;
    name?: string;
    description?: string;
    options: O;
    configure(partialOptions: Partial<O>): PluginType<TM, TOM, O>;
  } & TM &
    TOM;

  const createPlugin = <TOptions extends Record<string, SafeAny>>(
    config: PluginInitializationConfiguration<
      TOptions,
      TMethodName,
      TOptionalMethodName,
      TContext
    >
  ) => {
    return (partialOptions: Partial<TOptions> = {}) => {
      const {
        id,
        name,
        description,
        addOptions = () => ({}),
        ...lifecycles
      } = config;
      const options = addOptions();
      const configure = (partialOptions: Partial<TOptions>) => {
        Object.assign(options, partialOptions);
        return plugin;
      };
      const plugin = {
        id,
        name,
        description,
        options,
        configure,
      };
      configure(partialOptions);
      type RawLifecycles = typeof lifecycles;
      type Lifecycles = {
        [k in keyof RawLifecycles]?: (
          this: ReturnType<typeof createPlugin>,
          ...args: Parameters<NonNullable<RawLifecycles[k]>>
        ) => void;
      };
      const newLifecycles: Lifecycles = {} as Lifecycles;
      for (const k in lifecycles) {
        newLifecycles[k as keyof Lifecycles] = (
          lifecycles[k as keyof RawLifecycles] as unknown as NonNullable<
            RawLifecycles[keyof RawLifecycles]
          >
        ).bind(plugin);
      }
      return Object.assign(plugin, newLifecycles) as unknown as PluginType<
        {
          [methdName in TMethodName]: (
            this: {
              id?: string;
              name?: string;
              description?: string;
              options: TOptions;
            },
            context: TContext
          ) => void;
        },
        {
          [methdName in TOptionalMethodName]?: (
            this: {
              id?: string;
              name?: string;
              description?: string;
              options: TOptions;
            },
            context: TContext
          ) => void;
        },
        TOptions
      >;
    };
  };
  return {
    createPlugin,
  };
};
