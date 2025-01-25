# Zenmark

✍️ Zenmark is an open-source WYSIWYG Markdown editor inspired by Typora, offering a smooth writing experience with rich features.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

English | [简体中文](./README_zh-CN.md)

## ✨ Features

- 🎯 **WYSIWYG**: Real-time Markdown preview
- 📝 **Smart Editing**: Keyboard shortcuts and command palette
- 🎨 **Code Highlighting**: Syntax highlighting for multiple languages
- 📊 **Table Editing**: Intuitive table editing experience
- ✅ **Task Lists**: Interactive task lists
- 🔢 **Math Formulas**: LaTeX math formula support
- 🖼️ **Image Management**: Drag-and-drop image upload
- 🔌 **Extensible**: Plugin-based architecture
- 🌍 **i18n**: Multi-language interface
- 💾 **Auto Save**: Automatic document saving

## 🚀 Getting Started

### Use as a Component

```bash
npm install zenmark
```

```jsx
import { Zenmark } from 'zenmark';

function App() {
  return <Zenmark defaultValue="# Hello Zenmark!" />;
}
```

## 📖 Documentation

### Basic Configuration

```jsx
<Zenmark
  theme="light" // Theme: 'light' | 'dark' | 'auto'
  language="en-US" // Language: 'en-US' | 'zh-CN'
  autosave={true} // Enable auto save
  onChange={(markdown) => console.log(markdown)} // Content change callback
/>
```

### Plugin System

Zenmark supports feature extension through plugins:

```jsx
import { Zenmark, createPlugin } from 'zenmark';

const myPlugin = createPlugin({
  name: 'my-plugin',
  // Plugin configuration...
});

function App() {
  return <Zenmark plugins={[myPlugin]} />;
}
```

## 📄 License

[MIT License](LICENSE) 