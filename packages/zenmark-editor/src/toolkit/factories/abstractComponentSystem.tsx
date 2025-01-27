/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";
export const createAbstractComponentSystem = <TComp,>(
  createComponent: (compProps: { id?: string }) => TComp
) => {
  type ComponentDefinition<T extends Record<string, any>> = (
    props: T,
    comp: TComp
  ) => ReactNode;

  const useCompRef = (): {
    current: TComp | null;
  } => {
    return useMemo(
      () => ({
        current: null,
      }),
      []
    );
  };
  const ParentAtomContext = createContext<TComp | null>(null);
  const useParentComponent = () => {
    return useContext(ParentAtomContext);
  };
  const compMap = new Map<string, TComp>();

  const getComponentById = (id: string) => {
    return compMap.get(id);
  };
  const defineComponent = <T extends Record<string, any>>(
    def: ComponentDefinition<T>
  ) => {
    return (
      props: Parameters<typeof def>[0] & {
        compRef?: ReturnType<typeof useCompRef>;
        compId?: string;
      }
    ) => {
      const { compId: id } = props;
      const comp = useMemo(() => createComponent({ id }), []);
      useEffect(() => {
        if (id && !compMap.has(id)) {
          compMap.set(id, comp);
        }
        return () => {
          if (id && compMap.has(id) && compMap.get(id) === comp) {
            compMap.delete(id);
          }
        };
      }, []);
      const { compRef } = props;
      useEffect(() => {
        if (compRef) {
          compRef.current = comp;
        }
      }, [compRef, comp]);
      return (
        <ParentAtomContext.Provider value={comp}>
          {def(props, comp)}
        </ParentAtomContext.Provider>
      );
    };
  };
  return {
    defineComponent,
    useCompRef,
    useParentComponent,
    getComponentById,
  };
};
