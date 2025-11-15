export const DEFAULT_MARKDOWN = `# Zenmark Playground

Welcome! Start typing your Markdown here and see it rendered in real-time on the right.

## Features

- **Real-time preview**: See your changes instantly
- **Auto-save**: Your content is automatically saved to localStorage

Enjoy editing!`;

export const STORAGE_KEYS = {
  CONTENT: "playground:content",
  EXAMPLE_ID: "playground:exampleId",
} as const;
