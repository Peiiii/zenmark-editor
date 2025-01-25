# Zenmark

✍️ Zenmark is an open-source WYSIWYG Markdown editor inspired by Typora, offering a smooth writing experience with rich features.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

English | [简体中文]()

## ✨ 特性

- 🎯 **所见即所得**: 实时预览 Markdown 渲染效果
- 📝 **智能编辑**: 支持快捷键、命令面板等高效编辑功能
- 🎨 **代码高亮**: 支持多种编程语言的语法高亮
- 📊 **表格编辑**: 直观的表格编辑体验
- ✅ **任务列表**: 支持可交互的任务列表
- 🔢 **数学公式**: 支持 LaTeX 数学公式
- 🖼️ **图片管理**: 支持图片拖拽上传
- 🔌 **可扩展**: 插件化架构,易于扩展
- 🌍 **国际化**: 支持多语言界面
- 💾 **自动保存**: 自动保存文档更改

## 🚀 快速开始

### 作为组件使用

```bash
npm install zenmark
```

```jsx
import { Zenmark } from 'zenmark';

function App() {
  return <Zenmark defaultValue="# Hello Zenmark!" />;
}
```

## 📖 使用文档

### 基础配置

```jsx
<Zenmark
  theme="light" // 主题:'light' | 'dark' | 'auto'
  language="zh-CN" // 语言:'zh-CN' | 'en-US'
  autosave={true} // 是否自动保存
  onChange={(markdown) => console.log(markdown)} // 内容变化回调
/>
```

### 插件系统

Zenmark 支持通过插件扩展功能:

```jsx
import { Zenmark, createPlugin } from 'zenmark';

const myPlugin = createPlugin({
  name: 'my-plugin',
  // 插件配置...
});

function App() {
  return <Zenmark plugins={[myPlugin]} />;
}
```

## 📄 许可证

[MIT License](LICENSE)
