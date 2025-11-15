import { BasicExample } from "./BasicExample";
import { SaveDemoExample } from "./SaveDemoExample";
import type { Example, ExampleId } from "./types";

export const examples: Example[] = [
  {
    id: "basic",
    name: "基础示例",
    description: "简单的 Markdown 编辑和预览",
    component: BasicExample,
  },
  {
    id: "save-demo",
    name: "保存功能演示",
    description: "演示自动保存、保存历史和数据统计",
    component: SaveDemoExample,
  },
];

export function getExample(id: ExampleId): Example | undefined {
  return examples.find((ex) => ex.id === id);
}

