import { Node } from "@tiptap/core";
import { defaultMarkdownSerializer } from "@tiptap/pm/markdown";


const Paragraph = Node.create({
    name: 'paragraph',
});

export default Paragraph.extend({
    /**
     * @return {{markdown: MarkdownNodeSpec}}
     */
    addStorage() {
        return {
            markdown: {
                serialize: defaultMarkdownSerializer.nodes.paragraph,
                parse: {
                    // handled by markdown-it
                },
            },
        }
    }
});
