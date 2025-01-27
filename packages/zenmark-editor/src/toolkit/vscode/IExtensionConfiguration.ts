/* eslint-disable @typescript-eslint/no-explicit-any */
// 定义基础配置项
interface BaseConfigItem {
  type: string;
  default?: any;
  description?: string;
  markdownDescription?: string;
  scope?: "window" | "resource" | "application";
  deprecationMessage?: string;
  markdownDeprecationMessage?: string;
}

// 定义数值类型配置项
interface NumberConfigItem extends BaseConfigItem {
  type: "number";
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: boolean;
  exclusiveMaximum?: boolean;
}

// 定义字符串类型配置项
interface StringConfigItem extends BaseConfigItem {
  type: "string";
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternErrorMessage?: string;
  format?: "date" | "time" | "ipv4" | "email" | "uri";
  editPresentation?: "singleline" | "multiline";
}

// 定义布尔类型配置项
interface BooleanConfigItem extends BaseConfigItem {
  type: "boolean";
}

// 定义对象类型配置项
interface ObjectConfigItem extends BaseConfigItem {
  type: "object";
  properties: Record<string, ConfigItem>;
  additionalProperties?: boolean;
}

// 定义数组类型配置项
interface ArrayConfigItem extends BaseConfigItem {
  type: "array";
  items: ConfigItem | ConfigItem[];
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
}

// 支持多类型定义
interface MultiTypeConfigItem {
  type: string[]; // 支持类型数组，比如["string", "null"]
  default?: any;
  description?: string;
  markdownDescription?: string;
  scope?: "window" | "resource" | "application";
  deprecationMessage?: string;
  markdownDeprecationMessage?: string;
  // JSON Schema 验证属性
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: boolean;
  exclusiveMaximum?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternErrorMessage?: string;
  format?: "date" | "time" | "ipv4" | "email" | "uri";
  editPresentation?: "singleline" | "multiline";
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
  additionalProperties?: boolean;
}

// 定义配置项可能的类型
export type ConfigItem =
  | StringConfigItem
  | NumberConfigItem
  | BooleanConfigItem
  | ObjectConfigItem
  | ArrayConfigItem
  | MultiTypeConfigItem; // 新增多类型支持

// 全局配置定义示例，现在可以包括多类型属性

// 单个配置项的基本结构
interface IConfigurationSection {
  title: string;
  properties: Record<string, ConfigItem>;
}

// 单个配置类别或多个配置类别的表示
export type IConfigurationContribute =
  | IConfigurationSection
  | IConfigurationSection[];
