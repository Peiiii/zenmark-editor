import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { SKIP, visit } from "unist-util-visit";
import yaml from "yaml";

export function extractAndRemoveFrontmatter(
  markdown: string
): [object | null, string] {
  let frontmatterData = null;
  let frontmatterExists = false;

  const processor = unified()
    .use(remarkParse)
    .use(remarkStringify)
    .use(remarkFrontmatter, ["yaml"])
    .use(() => (tree) => {
      visit(tree, "yaml", (node: any, index, parent: any) => {
        frontmatterData = yaml.parse(node.value);
        frontmatterExists = true;
        // 移除Frontmatter节点
        parent.children.splice(index, 1);
        return SKIP; // 停止进一步访问
      });
      //   return frontmatterExists ? SKIP : CONTINUE; // 如果找到Frontmatter，停止处理
    });

  const processedContent = processor.processSync(markdown.trim()).toString();

  // 如果没有Frontmatter，返回原始Markdown内容
  return frontmatterExists
    ? [frontmatterData, processedContent]
    : [null, markdown];
}


// 修改或添加Frontmatter的函数
export function modifyFrontmatter(
  markdown: string,
  modifications: object
): string {
  let frontmatterExists = false;
  const processor = unified()
    .use(remarkParse)
    .use(remarkStringify)
    .use(remarkFrontmatter, ["yaml"])
    .use(() => (tree) => {
      visit(tree, "yaml", (node: any, index: number, parent) => {
        frontmatterExists = true;
        console.log("yaml node", node);

        const frontmatterData = yaml.parse(node.value);
        const newFrontmatter = yaml.stringify({
          ...frontmatterData,
          ...modifications,
        });
        parent.children[index] = { type: "yaml", value: newFrontmatter };
      });
    });

  const modifiedMarkdown = processor.processSync(markdown).toString();

  if (!frontmatterExists) {
    const newFrontmatter = `---\n${yaml.stringify(modifications)}---\n`;
    return newFrontmatter + modifiedMarkdown;
  }

  return modifiedMarkdown;
}