/* eslint-disable @typescript-eslint/no-explicit-any */
import { createBean, define } from "@/toolkit/factories/bean";

export interface ParameterDescriptor {
  name: string; // 参数名
  type: "string" | "number" | "boolean" | "object" | "array"; // 参数类型
  required?: boolean; // 是否必需，默认为false
  default?: any; // 默认值，可选
  description?: string; // 参数描述，可选
}

export interface ComponentDescriptor {
  component: any; // 组件实体
  description?: string; // 组件的描述信息
  parameters?: ParameterDescriptor[]; // 组件的参数描述列表，可选
}

export interface ComponentRegistration {
  name: string;
  component: any;
  description?: string;
  parameters?: ParameterDescriptor[];
}

export const ComponentBox = define(() => {
  const bean = createBean<Record<string, ComponentDescriptor>>({});

  const registerComponent = ({
    name,
    component,
    description,
    parameters,
  }: ComponentRegistration) => {
    bean.set({
      ...bean.get(),
      [name]: { component, description, parameters },
    });
  };

  const getComponent = (name: string) => bean.get()[name]?.component;

  const getComponentParameters = (name: string) => bean.get()[name]?.parameters;

  const useComponent = (name: string) => {
    // 使用组件的实现依据具体应用场景
    return getComponent(name);
  };

  const searchComponents = (query: string) => {
    const allComponents = bean.get();
    return Object.keys(allComponents)
      .filter(
        (key) =>
          allComponents[key].description?.includes(query) ||
          (allComponents[key].parameters || []).some(
            (param) =>
              param.name.includes(query) || param.description?.includes(query)
          )
      )
      .reduce((acc, key) => ({ ...acc, [key]: allComponents[key] }), {});
  };

  const listComponents = () => {
    return Object.keys(bean.get()).map((key) => ({
      name: key,
      ...bean.get()[key],
    }));
  };

  const describeSelf = () => {
    return `ComponentBox: a box for managing components.
    components includes:
    ${JSON.stringify(listComponents(), null, 2)}
    `;
  };

  return Object.assign(bean, {
    registerComponent,
    getComponent,
    useComponent,
    searchComponents,
    getComponentParameters,
    listComponents,
    describeSelf,
  });
});
