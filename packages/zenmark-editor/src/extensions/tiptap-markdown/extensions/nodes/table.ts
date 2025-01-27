import { Node } from "@tiptap/core";
import { childNodes } from "../../util/prosemirror";
import HTMLNode from "./html";
import markdownItMultimdTable from "markdown-it-multimd-table";

const Table = Node.create({
  name: "table",
});

export default Table.extend({
  /**
   * @return {{markdown: MarkdownNodeSpec}}
   */
  addStorage() {
    return {
      markdown: {
        serialize(state, node, parent) {
          if (!isMarkdownSerializable(node)) {
            HTMLNode.storage.markdown.serialize.call(this, state, node, parent);
            return;
          }
          node.forEach((row, p, i) => {
            state.write("| ");
            row.forEach((col, p, j) => {
              if (j) {
                state.write(" | ");
              }
              const cellContent = col.firstChild;
              if (cellContent.textContent.trim()) {
                state.renderInline(cellContent);
              }
            });
            state.write(" |");
            state.ensureNewLine();
            if (!i) {
              // console.log("row:", row);
              const delimiterRow = row.content.content
                .map(
                  (child) =>
                    `${child.attrs.textAlign === "right" ? "" : ":"}---${
                      child.attrs.textAlign === "left" ? "" : ":"
                    }`
                )
                .join(" | ");
              state.write(`| ${delimiterRow} |`);
              state.ensureNewLine();
            }
          });
          state.closeBlock(node);
        },
        parse: {
          // handled by markdown-it
          setup(markdownit) {
            markdownit.use(markdownItMultimdTable);
            // markdownit.use(markdownItTable);
            // markdownit.use(markdownitTexMath);
          },
        },
      },
    };
  },
});

function hasSpan(node) {
  return node.attrs.colspan > 1 || node.attrs.rowspan > 1;
}

function isMarkdownSerializable(node) {
  const rows = childNodes(node);
  const firstRow = rows[0];
  const bodyRows = rows.slice(1);

  if (
    childNodes(firstRow).some(
      (cell) => cell.type.name !== "tableHeader" || hasSpan(cell)
    )
  ) {
    return false;
  }

  if (
    bodyRows.some((row) =>
      childNodes(row).some(
        (cell) => cell.type.name === "tableHeader" || hasSpan(cell)
      )
    )
  ) {
    return false;
  }

  return true;
}
