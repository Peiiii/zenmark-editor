import { Extension } from "@tiptap/core";
import {
  defaultMarkdownSerializer,
  MarkdownSerializer,
} from "@tiptap/pm/markdown";
import { message } from "../common/utils";
// console.log(defaultMarkdownSerializer.nodes, defaultMarkdownSerializer.marks);
const markdownSerializer = new MarkdownSerializer(
  {
    ...defaultMarkdownSerializer.nodes,
    math_inline: (state, node: any) => {
      state.write(`$${node.textContent}$`);
    },
    math_display: (state, node: any) =>
      state.write(`\n$$\n${node.textContent}\n$$`),
    codeBlock: defaultMarkdownSerializer.nodes.code_block,
    bulletList: defaultMarkdownSerializer.nodes.bullet_list,
    listItem: defaultMarkdownSerializer.nodes.list_item,
    hardBreak: defaultMarkdownSerializer.nodes.hard_break,
    orderedList: defaultMarkdownSerializer.nodes.ordered_list,
    taskList: (state, node) => {
      // console.log(node);
      // console.log(node.content.content)
      state.renderList(
        node,
        "  ",
        (i) =>
          `[${(node.content as any).content[i].attrs.checked ? "x" : " "}]` +
          " "
      );
    },
    taskItem: (state, node) => {
      // console.log(node);
      state.renderContent(node);
    },
  },
  {
    ...defaultMarkdownSerializer.marks,
    bold: defaultMarkdownSerializer.marks.strong,
    italic: defaultMarkdownSerializer.marks.em,
    strike: {
      open: "~~",
      close: "~~",
      mixable: true,
      expelEnclosingWhitespace: true,
    },
  }
);
export const SaveFile = Extension.create({
  name: "saveFile",
  addOptions() {
    return {
      saveContent: null,
    };
  },
  addCommands() {
    return {
      saveFile:
        () =>
        async ({ commands, editor }) => {
          const m = editor.storage.markdown.getMarkdown();
          // console.log("tiptap-markdown output:");
          // console.log(m);
          const content = editor.getHTML();
          // console.log("html output:", content);
          //   console.log("doc:", editor.state.doc);
          // console.log(
          //   "markdown:",
          //   markdownSerializer.serialize(editor.state.doc)
          // );
          if (this.options.saveContent) {
            this.options.saveContent(m).then(() => {
              message.success("File saved");
            });
          }
        },
    } as any;
  },
  addKeyboardShortcuts() {
    return {
      "Ctrl-s": () => (this.editor.commands as any).saveFile(),
    };
  },
});
