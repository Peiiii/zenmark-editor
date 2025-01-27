// 定义代码块部分的内容
const codeBlockSection = 
  '````markdown\n' +
  '```\n' +  // 使用4个反引号，这样内部的3个反引号就不会结束代码块
  'import React from \'react\';\n' +
  '```\n' +
  '````\n\n' +
  'rendered as:\n\n' +
  '```\n' +
  'import React from \'react\';\n' +
  '```';

// 使用常量存储Markdown内容
export const markdownExampleZh = `
# Markdown 教程

## 概述
- 标题
- 段落
- 列表
- 链接
- 图片
- 代码
- 引用
- 表格
- 分隔线
- 换行
- 内联HTML
- 删除线
- 任务列表
- 数学公式
- 表情符号

## 介绍

Markdown是一种轻量级标记语言，具有纯文本格式化语法。它的设计可以转换成多种输出格式，但最初的工具就是Markdown。

## 标题

\`\`\`markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
\`\`\`

渲染效果：

# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题

## 段落

\`\`\`markdown
段落是Markdown中的基本文本单位。它们只是没有任何格式的文本块。
\`\`\`

渲染效果：

段落是Markdown中的基本文本单位。它们只是没有任何格式的文本块。

## 列表

\`\`\`markdown
- 项目1
- 项目2
- 项目3
\`\`\`

渲染效果：

- 项目1
- 项目2
- 项目3

## 链接

\`\`\`markdown
[链接文本](https://example.com)
\`\`\`

渲染效果：

[链接文本](https://example.com)

## 图片

\`\`\`markdown
![猫咪图片](https://images.unsplash.com/photo-1494256997604-768d1f608cac?q=80&w=3029&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)
\`\`\`

渲染效果：

![猫咪图片](https://images.unsplash.com/photo-1494256997604-768d1f608cac?q=80&w=3029&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)

## 代码

${codeBlockSection}

## 引用

\`\`\`markdown
> 这是一个引用。
\`\`\`

渲染效果：

> 这是一个引用。

## 表格

\`\`\`markdown
| 第一列 | 第二列 | 第三列 |
| ------ | ------ | ------ |
| 第1行第1列 | 第1行第2列 | 第1行第3列 |
| 第2行第1列 | 第2行第2列 | 第2行第3列 |
\`\`\`

渲染效果：

| 第一列 | 第二列 | 第三列 |
| ------ | ------ | ------ |
| 第1行第1列 | 第1行第2列 | 第1行第3列 |
| 第2行第1列 | 第2行第2列 | 第2行第3列 |

## 分隔线

\`\`\`markdown
***
\`\`\`

渲染效果：

***

## 换行

\`\`\`markdown
这是第一行。

这是第二行。
\`\`\`

渲染效果：

这是第一行。

这是第二行。

## 内联HTML

\`\`\`markdown
<p>这是一个内联HTML元素。</p>
\`\`\`

渲染效果：

<p>这是一个内联HTML元素。</p>

## 删除线

\`\`\`markdown
~~这是删除线文本。~~
\`\`\`

渲染效果：

~~这是删除线文本。~~

## 任务列表

\`\`\`markdown
- [ ] 任务1
- [x] 任务2
\`\`\`

渲染效果：

- [ ] 任务1
- [x] 任务2

## 数学公式

\`\`\`markdown
行内公式: $E = mc^2$

块级公式:

$$
\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}
$$
\`\`\`

渲染效果：

行内公式: $E = mc^2$

块级公式:

$$
\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}
$$

## 表情符号

\`\`\`markdown
:smile: :heart: :thumbsup:
\`\`\`

渲染效果：

:smile: :heart: :thumbsup:
`; 