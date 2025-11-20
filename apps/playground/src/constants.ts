export const DEFAULT_MARKDOWN = `# Zenmark Playground

Welcome! Start typing your Markdown here and see it rendered in real-time on the right.

## Features

- **Real-time preview**: See your changes instantly
- **Auto-save**: Your content is automatically saved to localStorage

## Mermaid Diagram Example

You can create diagrams using Mermaid code blocks, just like in Markdown:

\`\`\`mermaid
graph LR
  A[开始] --> B{条件判断}
  B -->|是| C[处理成功]
  B -->|否| D[处理失败]
\`\`\`

Enjoy editing!`;

export const STORAGE_KEYS = {
  CONTENT: "playground:content",
  EXAMPLE_ID: "playground:exampleId",
} as const;
