export type ExampleId = "basic" | "save-demo" | "keyboard-event";

export interface Example {
  id: ExampleId;
  name: string;
  description: string;
  component: React.ComponentType;
}

