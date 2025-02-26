# Zenmark

✍️ Zenmark is an open-source WYSIWYG Markdown editor based on Tiptap, offering a smooth writing experience with rich features.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

English | [简体中文](./README_zh-CN.md)

## 🌐 Demo

[Live Demo](https://apps.eiooie.com/tiptap-editor/)

![Screenshot](screenshots/demo.jpeg)

## ✨ Features

- 🎯 **WYSIWYG**: Real-time Markdown preview
- 📝 **Smart Editing**: Keyboard shortcuts
- 🎨 **Code Highlighting**: Syntax highlighting powered by highlight.js
- 📊 **Table Editing**: Intuitive table editing experience
- ✅ **Task Lists**: Interactive task lists
- 🔢 **Math Formulas**: LaTeX math formula support with KaTeX
- 🌍 **i18n**: Multi-language interface
- 🤝 **Collaboration**: Real-time collaboration support with Yjs
- 🎨 **Theming**: Light and dark theme support
- 🔌 **Extensible**: Based on Tiptap's powerful extension system

## 🚀 Getting Started

### Use as a Component

```bash
npm install zenmark-editor
```

```jsx
import { ZenmarkEditor } from 'zenmark-editor';

function App() {
  return (
    <ZenmarkEditor
      readContent={() => Promise.resolve('# Hello Zenmark!')}
      writeContent={(content) => Promise.resolve()}
      subscribeContent={(cb) => () => {}}
    />
  );
}
```

## 📖 Documentation

### Props

- `readContent`: () => Promise<string> - Function to read the initial content
- `writeContent`: (content: string) => Promise<void> - Function to handle content updates
- `subscribeContent`: (callback: (content: string) => void) => () => void - Function to subscribe to content changes

## 📄 License

[MIT License](LICENSE) 