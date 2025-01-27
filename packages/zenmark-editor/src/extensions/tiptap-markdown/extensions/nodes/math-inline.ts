import { Node } from "@tiptap/core";

const MathInline = Node.create({
  name: "math_inline",
});

export default MathInline.extend({
  /**
   * @return {{markdown: MarkdownNodeSpec}}
   */
  addStorage() {
    return {
      markdown: {
        serialize(state, node) {
          state.write(`$${node.textContent}$`);
        },
        parse: {},
      },
    };
  },
});
