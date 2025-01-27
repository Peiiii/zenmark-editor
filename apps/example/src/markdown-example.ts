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
export const markdownExample = `
# Markdown Tutorial

## Overview
- Headings
- Paragraphs
- Lists
- Links
- Images
- Code
- Blockquotes
- Tables
- Horizontal Rules
- Line Breaks
- Inline HTML
- Strikethrough
- Task Lists
- Math Equations
- Emoji

## Introduction

Markdown is a lightweight markup language with plain text formatting syntax. Its design allows it to be converted to many output formats, but the original tool is Markdown.

## Headings

\`\`\`markdown
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
\`\`\`

rendered as:

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

## Paragraphs

\`\`\`markdown
Paragraphs are the basic unit of text in Markdown. They are simply a block of text without any formatting.
\`\`\`

rendered as:

Paragraphs are the basic unit of text in Markdown. They are simply a block of text without any formatting.

## Lists

\`\`\`markdown
- Item 1
- Item 2
- Item 3
\`\`\`

rendered as:

- Item 1
- Item 2
- Item 3

## Links

\`\`\`markdown
[Link Text](https://example.com)
\`\`\`

rendered as:

[Link Text](https://example.com)

## Images

\`\`\`markdown
![猫咪图片](https://images.unsplash.com/photo-1494256997604-768d1f608cac?q=80&w=3029&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)
\`\`\`

rendered as:

![猫咪图片](https://images.unsplash.com/photo-1494256997604-768d1f608cac?q=80&w=3029&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)

## Code

${codeBlockSection}

## Blockquotes

\`\`\`markdown
> This is a blockquote.
\`\`\`

rendered as:

> This is a blockquote.

## Tables

\`\`\`markdown
| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Row 1, Column 1 | Row 1, Column 2 | Row 1, Column 3 |
| Row 2, Column 1 | Row 2, Column 2 | Row 2, Column 3 |
\`\`\`

rendered as:

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Row 1, Column 1 | Row 1, Column 2 | Row 1, Column 3 |
| Row 2, Column 1 | Row 2, Column 2 | Row 2, Column 3 |

## Horizontal Rules

\`\`\`markdown
***
\`\`\`

rendered as:

***

## Line Breaks

\`\`\`markdown
This is a line break.

This is another line.
\`\`\`

rendered as:

This is a line break.

This is another line.

## Inline HTML

\`\`\`markdown
<p>This is an inline HTML element.</p>
\`\`\`

rendered as:

<p>This is an inline HTML element.</p>

## Strikethrough

\`\`\`markdown
~~This is a strikethrough text.~~
\`\`\`

rendered as:

~~This is a strikethrough text.~~

## Task Lists

\`\`\`markdown
- [ ] Task 1
- [x] Task 2
\`\`\`

rendered as:

- [ ] Task 1
- [x] Task 2

## Math Equations

\`\`\`markdown
Inline math: $E = mc^2$

Block math:

$$
\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}
$$
\`\`\`

rendered as:

Inline math: $E = mc^2$

Block math:

$$
\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}
$$

## Emoji

// ... existing code ...
`;
