/* eslint-disable @typescript-eslint/no-explicit-any */
// 为了简化示例，这里定义了基础和引用类型

type DataType =
  | "string"
  | "number"
  | "boolean"
  | "array"
  | "object"
  | "function"
  | "any";

// interface RefType {
//   $ref: string; // 用于引用其他定义的类型
// }

// interface ObjectType {
//   type: "object";
//   properties: {
//     [propertyName: string]: TypeDefinition;
//   };
//   required?: string[];
// }

// interface ArrayType {
//   type: "array";
//   items: TypeDefinition;
//   description?: string;
//   example?: any;
// }

// export type TypeDefinition = BasicType | ObjectType | ArrayType | RefType;

export interface Schema {
  type: DataType;
  format?: string;
  items?: Schema;
  enum?: Array<string | number | boolean>; // 枚举支持
  default?: any; // 默认值
  example?: any; // 样例值
}

export type Parameter = {
  name: string;
  schema: Schema;
  required?: boolean;
  description?: string;
};
