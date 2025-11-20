export const markdownPresets = {
  minimal: `# Hello Zenmark

Welcome to Zenmark Editor!

Start typing your Markdown here...`,

  full: `# Markdown 完整演示

## 标题

# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题

## 文本样式

**粗体文本** *斜体文本* ~~删除线~~ \`行内代码\`

## 列表

### 无序列表
- 项目 1
- 项目 2
  - 子项目 2.1
  - 子项目 2.2
- 项目 3

### 有序列表
1. 第一项
2. 第二项
   1. 子项 2.1
   2. 子项 2.2
3. 第三项

### 任务列表
- [x] 已完成的任务
- [ ] 待完成的任务
- [ ] 另一个待完成的任务

## 链接和图片

[链接文本](https://example.com)

![图片描述](https://images.unsplash.com/photo-1494256997604-768d1f608cac?w=400)

## 代码块

\`\`\`javascript
function hello() {
  console.log("Hello, Zenmark!");
}
\`\`\`

\`\`\`python
def hello():
    print("Hello, Zenmark!")
\`\`\`

## 引用

> 这是一个引用块。
> 
> 可以包含多行内容。

## 表格

| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |
| 数据4 | 数据5 | 数据6 |

## 分隔线

---

## 数学公式

行内公式：$E = mc^2$

块级公式：

$$
\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n
$$

## HTML

<div style="background: #f0f0f0; padding: 10px; border-radius: 5px;">
  这是一个 HTML 块
</div>`,

  article: `# 如何编写优秀的 Markdown 文档

## 引言

Markdown 是一种轻量级标记语言，它允许你使用易读易写的纯文本格式编写文档，然后转换成有效的 HTML。

## 最佳实践

### 1. 使用清晰的标题结构

保持标题层级清晰，不要跳过层级。

### 2. 合理使用列表

- 使用无序列表展示并列项
- 使用有序列表展示步骤
- 使用任务列表管理待办事项

### 3. 代码示例

\`\`\`typescript
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "Zenmark",
  age: 1
};
\`\`\`

### 4. 引用重要内容

> 记住：好的文档不仅仅是内容，更是沟通的艺术。

## 总结

掌握 Markdown 语法，可以让你的文档更加专业和易读。`,

  table: `# 表格演示

## 基础表格

| 功能 | 状态 | 优先级 |
|------|------|--------|
| 自动保存 | ✅ 完成 | 高 |
| 代码高亮 | ✅ 完成 | 高 |
| 数学公式 | ✅ 完成 | 中 |
| 协作编辑 | 🚧 进行中 | 中 |

## 对齐表格

| 左对齐 | 居中 | 右对齐 |
|:-------|:----:|-------:|
| 文本 | 文本 | 文本 |
| 更多文本 | 更多文本 | 更多文本 |

## 复杂表格

| 项目 | 描述 | 状态 | 负责人 |
|------|------|------|--------|
| 功能 A | 实现核心功能 | ✅ | Alice |
| 功能 B | 优化性能 | 🚧 | Bob |
| 功能 C | 修复 Bug | ⏳ | Charlie |`,

  code: `# 代码演示

## JavaScript

\`\`\`javascript
// 异步函数示例
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
\`\`\`

## TypeScript

\`\`\`typescript
// 泛型示例
function identity<T>(arg: T): T {
  return arg;
}

const result = identity<string>("Hello");
\`\`\`

## Python

\`\`\`python
# 列表推导式
numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers]
print(squares)  # [1, 4, 9, 16, 25]
\`\`\`

## CSS

\`\`\`css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
\`\`\``,

  mermaid: `# Mermaid 图表示例

Zenmark Editor 现在支持使用 Mermaid 语法作图。

下面是一些常见图表类型的示例，全部都可以在编辑器中直接编辑源码，并实时看到更新后的图表。

---

## 1. 流程图（Flowchart）

\`\`\`mermaid
graph LR
  A[开始] --> B{条件判断}
  B -->|是| C[处理成功]
  B -->|否| D[处理失败]
  C --> E[结束]
  D --> E[结束]
\`\`\`

---

## 2. 时序图（Sequence Diagram）

\`\`\`mermaid
sequenceDiagram
  participant User as 用户
  participant Browser as 浏览器
  participant Server as 服务器

  User->>Browser: 打开编辑页面
  Browser->>Server: 请求初始内容
  Server-->>Browser: 返回 Markdown
  Browser-->>User: 展示 Zenmark Editor
\`\`\`

---

## 3. 类图（Class Diagram）

\`\`\`mermaid
classDiagram
  class Editor {
    +string content
    +render(): void
    +save(): void
  }

  class MarkdownParser {
    +parse(text: string): Doc
  }

  Editor --> MarkdownParser : 使用
\`\`\`

---

## 4. 状态图（State Diagram）

\`\`\`mermaid
stateDiagram-v2
  [*] --> Idle
  Idle --> Editing : 输入内容
  Editing --> Saving : 自动保存
  Saving --> Idle : 保存完成
  Editing --> [*] : 关闭页面
\`\`\`

---

## 5. 甘特图（Gantt Diagram）

\`\`\`mermaid
gantt
  dateFormat  YYYY-MM-DD
  title 编辑器功能开发计划

  section 基础功能
  Markdown 支持      :done,    des1, 2025-01-01,2025-01-05
  代码高亮           :done,    des2, 2025-01-06,2025-01-10

  section 高级功能
  数学公式           :active,  des3, 2025-01-11,2025-01-15
  Mermaid 作图       :         des4, 2025-01-16,2025-01-20
\`\`\`

---

## 6. 饼图（Pie Chart）

\`\`\`mermaid
pie showData
  title 文档内容类型占比
  "普通文本" : 55
  "代码"     : 25
  "公式"     : 10
  "图表"     : 10
\`\`\`

---

## 7. 思维导图（Mindmap）

\`\`\`mermaid
mindmap
  root((文档内容))
    子节点 1
      子节点 1.1
      子节点 1.2
    子节点 2
      子节点 2.1
      子节点 2.2
    子节点 3
      子节点 3.1
\`\`\`

---

你可以以这些示例为基础，自由修改 mermaid 源码，来验证和展示编辑器的作图能力。`,
} as const;

export type PresetKey = keyof typeof markdownPresets;
