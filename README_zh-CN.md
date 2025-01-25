# Zenmark

✍️ Zenmark 是一个受 Typora 启发的开源所见即所得 Markdown 编辑器，提供流畅的写作体验和丰富的功能。

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[English](./README.md) | 简体中文

## ✨ 特性

- 🎯 **所见即所得**: 实时 Markdown 预览
- 📝 **智能编辑**: 键盘快捷键和命令面板
- 🎨 **代码高亮**: 支持多种语言的语法高亮
- 📊 **表格编辑**: 直观的表格编辑体验
- ✅ **任务列表**: 交互式任务列表
- 🔢 **数学公式**: 支持 LaTeX 数学公式
- 🖼️ **图片管理**: 拖拽上传图片
- 🔌 **可扩展**: 基于插件的架构
- 🌍 **国际化**: 多语言界面
- 💾 **自动保存**: 自动保存文档

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

## 📖 文档

### 基础配置

```jsx
<Zenmark
  theme="light" // 主题: 'light' | 'dark' | 'auto'
  language="zh-CN" // 语言: 'en-US' | 'zh-CN'
  autosave={true} // 启用自动保存
  onChange={(markdown) => console.log(markdown)} // 内容变更回调
/>
```

### 插件系统

Zenmark 支持通过插件扩展功能：

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
