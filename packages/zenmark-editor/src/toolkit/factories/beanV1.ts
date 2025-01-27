/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BehaviorSubject, Observable, map, skip } from "rxjs";

type BeanStateNode = {
  $: BehaviorSubject<any>;
  children: Record<string, BeanStateNode>;
};

type DataTree<T = Record<string, any>> = {
  data: T;
};

const getNodeData = (dataTree: DataTree, path?: string) => {
  if (!path) return dataTree.data;
  else {
    const route = path.split("::");
    let current = dataTree.data;
    for (let i = 0; i < route.length; i++) {
      if (!current[route[i]]) return undefined;
      current = current[route[i]];
    }
    return current;
  }
};

const shallowCopy = (value: any) => {
  if (typeof value === "object" && value !== null) {
    if (Array.isArray(value)) {
      // 如果是数组，执行数组的浅拷贝
      return [...value];
    } else {
      // 如果是对象，执行对象的浅拷贝
      return { ...value };
    }
  }
  // 其他类型，直接返回原值
  return value;
};

const setNodeData = (
  dataTree: DataTree,
  subscriberTree: BeanStateNode,
  path: string | undefined,
  value: any
) => {
  if (!path) {
    dataTree.data = value;
    subscriberTree.$.next(value);
  } else {
    const route = path.split("::");
    let parentData = dataTree.data;
    let parentSubscriberNode = subscriberTree; // initial parentSubscriberNode
    const prevValue = parentData[route[route.length - 1]];
    const hasChanged = prevValue !== value;

    const changed = [[parentSubscriberNode, parentData]]; // the nodes that are effected
    for (let i = 0; i < route.length - 1; i++) {
      if (parentData[route[i]] === undefined) parentData[route[i]] = {};
      parentData = parentData[route[i]];
      parentSubscriberNode = parentSubscriberNode?.children[route[i]];
      changed.push([parentSubscriberNode, parentData]);
    }

    // make the set take effect by setting at the cooresponding key in the parentData
    parentData[route[route.length - 1]] = value;
    // get the subscriber node that is cooresponding to the path
    const targetSubscriberNode =
      parentSubscriberNode?.children[route[route.length - 1]];
    changed.push([targetSubscriberNode, value]); // the last one is the target, which is also changed

    const tasks: (() => void)[] = [];
    // from the upper level to the lower level, notify the subscribers
    for (let i = 0; i < changed.length; i++) {
      const [subscriberNode, newData] = changed[i];
      if (subscriberNode) {
        // notify those nodes where the value changed caused by setting the value, with the shallow copy of the new value, the target node is notified with just the new value (no shallow copy)
        if (hasChanged) {
          tasks.push(() =>
            subscriberNode.$.next(
              i === changed.length - 1 ? newData : shallowCopy(newData)
            )
          );
          // console.log("notify Node:", newData, subscriberNode);
        }
      } else break;
    }

    tasks.reverse().forEach((task) => task());

    // notify children where the value changed caused by setting the value
    // Todo: do a better diff, now there is no diff, which is bad for the performance
    const notify = (
      subscriberNode: BeanStateNode,
      data: any,
      prevData: any
    ) => {
      if (data !== prevData) {
        subscriberNode.$.next(data);
        // console.log("notify Node:", data, subscriberNode);
      }
      Object.entries(subscriberNode.children).forEach(([key, child]) => {
        notify(child, data?.[key], prevData?.[key]);
      });
    };

    if (targetSubscriberNode)
      Object.entries(targetSubscriberNode.children).forEach(([key, child]) => {
        notify(child, value?.[key], prevValue?.[key]);
      });
  }
};

const useNodeData = (
  dataTree: DataTree,
  subscriberTree: BeanStateNode,
  path?: string
) => {
  const $ = getNode$(dataTree, subscriberTree, path);

  const [state, setState] = useState(getNodeData(dataTree, path));

  useEffect(() => {
    const sub = $.pipe(skip(1)).subscribe((value) => {
      setState(value);
    });
    return () => sub.unsubscribe();
  }, [$]);
  return state;
};

const getNode$ = (
  dataTree: DataTree,
  subscriberTree: BeanStateNode,
  path?: string
) => {
  if (!path) {
    return subscriberTree.$;
  } else {
    const route = path.split("::");
    let parentData = dataTree.data;
    let parentSubscriberNode = subscriberTree;
    for (let i = 0; i < route.length; i++) {
      // loop for route.length times to make parentData be the target
      if (parentData[route[i]] === undefined) parentData[route[i]] = {};
      // no subsriber yet
      if (parentSubscriberNode.children[route[i]] === undefined)
        parentSubscriberNode.children[route[i]] = {
          $: new BehaviorSubject(parentData[route[i]]),
          children: {},
        };
      parentData = parentData[route[i]];
      parentSubscriberNode = parentSubscriberNode.children[route[i]];
    }
    return parentSubscriberNode.$;
  }
};

export type IBeanOpName = "get" | "set" | "use" | "$";
type AsOp<
  D,
  T extends Uncapitalize<Extract<keyof D, string>>,
  P extends IBeanOpName
> = P extends "$" ? `${T}$` : `${P}${Capitalize<T>}`;

type IBeanShape<T> = {
  get: () => T;
  set: (value: T | ((prevValue: T) => T)) => void;
  use: () => T;
  // $: Observable<T>;
  $: BehaviorSubject<T>;
};

type StringKey<T> = Extract<keyof T, string>;
type INestedBean<T> = {
  [K in
    | IBeanOpName
    | (T extends object
        ? AsOp<T, Uncapitalize<StringKey<T>>, IBeanOpName>
        : never)
    | (T extends object ? StringKey<T> : never)]: K extends IBeanOpName
    ? // divider IBeanOp<T,K>
      //   IBeanOp<T, K>
      IBeanShape<T>[K]
    : // divider getXXX, useXXX, setXXX, XXX&
    // $
    K extends AsOp<T, infer X, "$">
    ? X extends StringKey<T>
      ? IBeanShape<T[X]>["$"]
      : never
    : // get
    K extends AsOp<T, infer X, "get">
    ? X extends StringKey<T>
      ? IBeanShape<T[X]>["get"]
      : never
    : // set
    K extends AsOp<T, infer X, "set">
    ? X extends StringKey<T>
      ? IBeanShape<T[X]>["set"]
      : never
    : // use
    K extends AsOp<T, infer X, "use">
    ? X extends StringKey<T>
      ? IBeanShape<T[X]>["use"]
      : never
    : // divider
    K extends StringKey<T>
    ? T extends object
      ? INestedBean<T[K]>
      : never
    : never;
};

const createNestedBeanInner = <T extends Record<string, any>>(
  dataTree: DataTree<T>,
  initialSubscriberTree?: BeanStateNode,
  scope?: string
): INestedBean<T> => {
  const subscriberTree = initialSubscriberTree || {
    $: new BehaviorSubject(dataTree.data),
    children: {},
  };
  const normalizeKey = (key: string) => {
    return scope ? `${scope}::${key}` : key;
  };
  return new Proxy(
    {},
    {
      get(target: any, actionAndProp) {
        if (actionAndProp in target) {
          return target[actionAndProp];
        }
        if (typeof actionAndProp === "string") {
          if (actionAndProp === "$") {
            return getNode$(dataTree as any, subscriberTree, scope);
          } else if (actionAndProp === "get") {
            return () => getNodeData(dataTree as any, scope);
          } else if (actionAndProp === "set") {
            return (value: any) =>
              setNodeData(
                dataTree as any,
                subscriberTree,
                scope,
                typeof value === "function"
                  ? value(getNodeData(dataTree as any, scope))
                  : value
              );
          } else if (actionAndProp === "use") {
            return () => useNodeData(dataTree as any, subscriberTree, scope);
          } else if (actionAndProp.endsWith("$")) {
            const path = normalizeKey(actionAndProp.slice(0, -1));
            return getNode$(dataTree as any, subscriberTree, path);
          } else if (/^get[A-Z][a-zA-Z0-9]*$/.test(actionAndProp)) {
            const path = normalizeKey(actionAndProp.slice(3));
            return () => getNodeData(dataTree as any, path);
          } else if (/^set[A-Z][a-zA-Z0-9]*$/.test(actionAndProp)) {
            const path = normalizeKey(actionAndProp.slice(3));
            return (value: any) =>
              setNodeData(
                dataTree as any,
                subscriberTree,
                path,
                typeof value === "function"
                  ? value(getNodeData(dataTree as any, path))
                  : value
              );
          } else if (/^use[A-Z][a-zA-Z0-9]*$/.test(actionAndProp)) {
            const path = normalizeKey(actionAndProp.slice(3));
            return () => useNodeData(dataTree as any, subscriberTree, path);
          } else {
            // is a name space
            return createNestedBeanInner(
              dataTree,
              subscriberTree,
              normalizeKey(actionAndProp)
            );
          }
        } else {
          return target[actionAndProp];
        }
      },
    }
  );
};

export const createBean = <T extends Record<string, any>>(
  data: T,
  initialSubscriberTree?: BeanStateNode,
  scope?: string
): INestedBean<T> => {
  return createNestedBeanInner({ data }, initialSubscriberTree, scope);
};

export const defineBean = <
  T extends Record<string, any>,
  O extends Record<string, any> | void,
  TInitArgs extends any[]
>(
  getData: (...args: TInitArgs) => T,
  init?: (bean: INestedBean<T>) => O
) => {
  type TFinalBean = typeof init extends undefined
    ? INestedBean<T>
    : INestedBean<T> & (O extends void ? object : O);
  const createInstance = (...args: TInitArgs): TFinalBean => {
    const bean = createBean(getData(...args));
    return (init ? Object.assign(bean, init(bean)) : bean) as any;
  };
  const useInstance = (...args: TInitArgs): TFinalBean => {
    return useMemo(() => createInstance(...args), []) as any;
  };
  const Context = createContext<TFinalBean | undefined>(undefined);
  const Provider = Context.Provider;
  const useExistingInstance = () =>
    useContext(Context) as TFinalBean | undefined;
  return {
    createInstance,
    useInstance,
    useExistingInstance,
    Provider,
  };
};

export const useStateFromObservable = <T>(
  subject: Observable<T>,
  defaultValue?: T
) => {
  const [state, setState] = useState(defaultValue);
  useEffect(() => {
    const sub = subject.subscribe((value) => setState(value));
    return () => sub.unsubscribe();
  }, [subject]);
  return state;
};

export const useStateFromBehaviorSubject = <T, T2>(
  subject: BehaviorSubject<T>,
  mapper?: Parameters<typeof map<T, T2>>[0]
) => {
  const mapperRef = useRef(mapper);
  const [state, setState] = useState(() => {
    let value;
    (subject as any)
      .pipe(map(mapperRef.current || ((x) => x)))
      .subscribe((v: T2) => (value = v));
    return value as typeof mapper extends undefined ? T : T2;
  });
  useEffect(() => {
    const sub = (subject as any)
      .pipe(mapperRef.current)
      .subscribe((value: any) => setState(value as any));
    return () => sub.unsubscribe();
  }, [subject]);
  return state;
};
