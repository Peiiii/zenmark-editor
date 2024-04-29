import { ComponentType, ReactNode, isValidElement } from "react";

export const createFunctionalUIBuilder = <
  Components extends Record<string, ComponentType>
>() => {
  type ComponentProps<K extends keyof Components> =
    (Components[K] extends React.ComponentClass
      ? ConstructorParameters<Components[K]>
      : Components[K] extends React.FC
      ? Parameters<Components[K]>
      : never)[0];

  type Node<K extends keyof Components = keyof Components> = {
    type: K;
    props?: ComponentProps<K>;
    children?: ReactNode | Node<K>[];
  };
  return new Proxy(
    {} as Record<
      keyof Components,
      (
        propsOrChildren?: Node["props"] | Node["children"],
        children?: Node["children"]
      ) => Node
    >,
    {
      get(_, p) {
        return (
          propsOrChildren?: Node["props"] | Node["children"],
          children?: Node["children"]
        ) => {
          if (
            Array.isArray(propsOrChildren) ||
            typeof propsOrChildren === "string" ||
            typeof propsOrChildren === "number" ||
            typeof propsOrChildren === "boolean" ||
            isValidElement(propsOrChildren)
          ) {
            // first argument is children

            return {
              type: p,
              children: propsOrChildren,
            };
          } else {
            if (children && !Array.isArray(children)) {
              children = [children];
            }
            return {
              type: p,
              props: propsOrChildren,
              children,
            };
          }
        };
      },
    }
  );
};
