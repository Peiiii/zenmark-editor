import { Key } from "@/toolkit/types";
import { getPlainKey } from "@/toolkit/utils/typedKey";
import {
  Draft,
  combineReducers,
  configureStore,
  createSlice,
} from "@reduxjs/toolkit";
import { Fragment, ReactNode, isValidElement, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Provider, useSelector } from "react-redux";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SafeAny = any;
export type ComponentNode = React.ComponentType<SafeAny>;
export type ComponentRegistry = Record<string, ComponentNode>;

function matchPath(path: string, routePath: string) {
  function parseQueryParams(search: string) {
    const searchParams = new URLSearchParams(search);
    const params = Object.fromEntries(searchParams);
    return params;
  }
  const re = new RegExp("^" + routePath.replace(/:\w+/g, "([\\w-]+)") + "$");
  const match = path.match(re);
  if (match) {
    const params: Record<string, string> = {};
    const paramNames = routePath.match(/:(\w+)/g)
      ? routePath.match(/:(\w+)/g)!.map((s) => s.slice(1))
      : [];
    for (let i = 1; i < match.length; i++) {
      params[paramNames[i - 1]] = match[i];
    }
    Object.assign(params, parseQueryParams(location.search));
    return {
      match: path,
      params: params,
    };
  } else {
    return false;
  }
}
function ErrorFallback({ error, resetErrorBoundary }: SafeAny) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}
// 创建渲染系统和API
export const createRenderer = <
  TRegistry extends ComponentRegistry = ComponentRegistry
>(
  registryName: string = "componentRegistry"
) => {
  // 动态组件注册表

  const slice = createSlice({
    initialState: {} as TRegistry,
    name: registryName,
    reducers: {
      register(state, action) {
        const { name, component, override } = action.payload;
        if (state[name] && !override) return;
        state[name as keyof Draft<TRegistry>] = component;
      },
    },
  });

  const store = configureStore({
    reducer: combineReducers({
      [registryName]: slice.reducer,
    }),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });

  const useComponent = <K extends keyof TRegistry>(name: K) =>
    useSelector<SafeAny, ComponentNode>((state) => {
      const component = state![registryName][name];
      if (component) return component;
      else {
        for (const namePattern in state![registryName]) {
          const matcher = matchPath(name as string, namePattern);
          if (matcher) {
            return state![registryName][namePattern];
          }
        }
      }
    });

  // 注册组件
  const registerComponent = <K extends keyof TRegistry>(
    name: K,
    component: TRegistry[K],
    override: boolean = false
  ) => {
    store.dispatch(slice.actions.register({ name, component, override }));
  };

  interface LayoutNode<K extends keyof TRegistry = keyof TRegistry> {
    type: K;
    props?: TRegistry[K] extends React.ComponentClass
    ? ConstructorParameters<TRegistry[K]>[0]
    : TRegistry[K] extends React.FC
    ? Parameters<TRegistry[K]>[0]
    : TRegistry[K] extends (...args: SafeAny) => SafeAny
    ? Parameters<TRegistry[K]>
    : never;
    children?: LayoutNode<K>[] | React.ReactNode;
  }
  // 渲染系统
  const Renderer = ({ layout, fallback = <></> }: { layout: LayoutNode, fallback?: ReactNode }) => {
    // 渲染节点
    const { type, children, props } = layout;
    // console.log("load compo:", type);
    const Component = useComponent(type);

    if (!Component) {
      return fallback;
    }

    const ReactComponent = Component as React.ComponentType<SafeAny>;
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ReactComponent {...props}>
          {props?.children ||
            (children && Array.isArray(children)
              ? children.map((child, index) =>
                isValidElement(child) ? (
                  <Fragment key={index}>{child}</Fragment>
                ) : (
                  <Renderer key={index} layout={child} />
                )
              )
              : children)}
        </ReactComponent>
      </ErrorBoundary>
    );
  };

  function register<
    K extends keyof TRegistry | undefined,
    TComponents extends Partial<TRegistry>
  >(
    nameOrComponents: K | TComponents,
    componentOrOverride?: K extends undefined
      ? boolean
      : TRegistry[NonNullable<K>],
    OverrideOrUndefined?: boolean
  ): void {
    if (typeof nameOrComponents === "string") {
      const name = nameOrComponents as NonNullable<K>;
      const component = componentOrOverride as TRegistry[NonNullable<K>];
      const override = OverrideOrUndefined || false;
      registerComponent(name, component, override);
    } else {
      const components = nameOrComponents as TComponents;
      const override = (componentOrOverride || false) as boolean;
      Object.entries(components).forEach(([name, component]) => {
        registerComponent(name, component, override);
      });
    }
  }

  // 渲染
  const render = (layout: LayoutNode, key = 0, fallback: ReactNode = <></>) => {
    return (
      <Provider key={key} store={store}>
        <Renderer key={key} layout={layout} fallback={fallback} />
      </Provider>
    );
  };
  const renderData = <T,>(key: Key<T>, data: T) => {
    return render({
      type: getPlainKey(key) as keyof TRegistry,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      props: data as any,
    });
  };
  const ComponentProvider = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  const getComponents = () => {
    return store.getState()[registryName];
  };
  const useComponents = () => {
    const [state, setState] = useState(store.getState()[registryName]);
    useEffect(() => {
      return store.subscribe(() => {
        setState(store.getState()[registryName]);
      });
    }, []);
    return state;
  };
  return {
    register,
    render,
    getComponents,
    useComponent,
    renderData,
    ComponentProvider,
    useComponents,
  };
};

export type Renderer = ReturnType<typeof createRenderer>;
