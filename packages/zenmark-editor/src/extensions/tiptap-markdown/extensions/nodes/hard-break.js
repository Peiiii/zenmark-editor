import { Node } from "@tiptap/core";
import { defaultMarkdownSerializer } from "@tiptap/pm/markdown";


const HardBreak = Node.create({
    name: 'hardBreak',
});

export default HardBreak.extend({
    /**
     * @return {{markdown: MarkdownNodeSpec}}
     */
    addStorage() {
        return {
            markdown: {
                serialize: defaultMarkdownSerializer.nodes.hard_break,
                parse: {
                    // handled by markdown-it
                },
            }
        }
    }
});
