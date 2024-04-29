import { Parameter } from "@/toolkit/types/openApi";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ApiRequest {
  path: string;
  arguments: any[];
  preload?: boolean;
  async?: boolean;
}

type ApiHandler = (request: ApiRequest) => any;

interface FunctionSchema {
  description?: string;
  parameters: Parameter[];
  returnType?: TypeString;
  async?: boolean;
  preload?: boolean;
}

type TypeString =
  | "string"
  | "number"
  | "boolean"
  | "void"
  | "any"
  | "unknown"
  | "never"
  | "object"
  | `${string}[]`
  | `${string} | ${string}`
  | `${string} & ${string}`;

type StringToType<T extends TypeString> = T extends "string"
  ? string
  : T extends "number"
  ? number
  : T extends "boolean"
  ? boolean
  : T extends "void"
  ? void
  : T extends "any"
  ? any
  : T extends "unknown"
  ? unknown
  : T extends "never"
  ? never
  : T extends "object"
  ? object
  : T extends `${infer U}[]`
  ? U extends TypeString
    ? StringToType<U>[]
    : never
  : T extends `${infer U} | ${infer V}`
  ? U extends TypeString
    ? V extends TypeString
      ? StringToType<U> | StringToType<V>
      : never
    : never
  : T extends `${infer U} & ${infer V}`
  ? U extends TypeString
    ? V extends TypeString
      ? StringToType<U> & StringToType<V>
      : never
    : never
  : T;

// type ParseParameterType<T extends Parameter> = StringToType<T["type"]>;

type SchemaToFunction<T extends FunctionSchema> = {
  // (
  //   arg0: ParseParameterType<T["parameters"][0]>,
  //   arg1: ParseParameterType<T["parameters"][1]>,
  // ): StringToType<T["returnType"]>;
  (...args: any[]): T["returnType"] extends undefined
    ? void
    : StringToType<NonNullable<T["returnType"]>>;
};

type NamespaceContent = {
  [key: string]: FunctionSchema | NamespaceSchema;
};

interface NamespaceSchema {
  $type?: "namespace";
  members: NamespaceContent;
}

type ApiObject<T extends NamespaceSchema> = {
  [P in keyof T["members"]]: T["members"][P] extends NamespaceSchema
    ? ApiObject<T["members"][P]> // 递归构建嵌套命名空间的类型
    : T["members"][P] extends FunctionSchema
    ? SchemaToFunction<T["members"][P]>
    : never;
};

// 更新函数签名，仅接受 NamespaceSchema 作为参数
export function createApiFromSchema<T extends NamespaceSchema>(
  schema: T,
  handler: ApiHandler,
  path: string = ""
): ApiObject<T> {
  // 由于已经明确参数类型为 NamespaceSchema，因此无需再进行类型检查
  const apiObject = Object.keys(schema.members).reduce((acc, key) => {
    const item = schema.members[key];
    const currentPath = path ? `${path}.${key}` : key;
    if ("members" in item) {
      // 直接使用成员检查代替isNamespaceSchema，简化了调用
      acc[key] = createApiFromSchema(item, handler, currentPath); // 递归构建
    } else {
      acc[key] = (...args: any[]) => {
        // 构造请求对象，包含路径、参数、是否预加载及是否异步信息
        const request: ApiRequest = {
          path: currentPath,
          arguments: args,
          preload: item.preload ?? false,
          async: item.async,
        };
        // 将请求对象传递给 handler 处理
        return handler(request);
      };
    }
    return acc;
  }, {} as any);

  // 冻结API对象，确保不变性
  return Object.freeze(apiObject);
}
