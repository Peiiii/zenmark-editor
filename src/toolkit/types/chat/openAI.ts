interface ToolFunctionParameter {
  type: string;
  description: string;
  enum?: string[];
}

interface ToolFunctionParameters {
  [key: string]: ToolFunctionParameter;
}

interface ToolFunction {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: ToolFunctionParameters;
    required?: string[];
  };
}

export interface Tool {
  type: string;
  function: ToolFunction;
}

export type ToolCallResponse = {
  index: number;
  id?: string;
  type: string;
  function?: {
    arguments: string;
    name?: string;
  };
};
