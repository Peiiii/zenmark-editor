export type ExampleId = "basic" | "save-demo";

export interface Example {
  id: ExampleId;
  name: string;
  description: string;
  component: React.ComponentType;
}

