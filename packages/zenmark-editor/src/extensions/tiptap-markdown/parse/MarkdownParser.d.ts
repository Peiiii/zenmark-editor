export class MarkdownParser {
    constructor(editor: any, { html, linkify, breaks }: {
        html: any;
        linkify: any;
        breaks: any;
    });
    /**
     * @type {import('@tiptap/core').Editor}
     */
    editor: import('@tiptap/core').Editor;
    /**
     * @type {markdownit}
     */
    md: markdownit;
    parse(content: any, { inline }?: {
        inline: any;
    }): any;
    normalizeDOM(node: any, { inline, content }?: {
        inline: any;
        content: any;
    }): any;
    normalizeBlocks(node: any): void;
    normalizeInline(node: any, content: any): void;
}
