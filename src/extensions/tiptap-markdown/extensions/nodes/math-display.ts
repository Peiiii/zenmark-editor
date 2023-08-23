import { Node } from "@tiptap/core";
import texmath from "../../parse/texmath";
import markdownitTexMath from "markdown-it-texmath";

const MathInline = Node.create({
  name: "math_display",
});
export default MathInline.extend({
  /**
   * @return {{markdown: MarkdownNodeSpec}}
   */
  addStorage() {
    return {
      markdown: {
        serialize(state, node) {
          state.write(`\n$$\n${node.textContent}\n$$\n`);
        },
        parse: {
          setup(markdownit) {
            markdownit.use(texmath);
            // markdownit.use(markdownitTexMath);
          },
        },
      },
    };
  },
});
