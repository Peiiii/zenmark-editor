export class MarkdownSerializer {
    constructor(editor: any);
    /**
     * @type {import('@tiptap/core').Editor}
     */
    editor: import('@tiptap/core').Editor;
    serialize(content: any): any;
    get nodes(): {
        [x: string]: any;
    };
    get marks(): {
        [x: string]: any;
    };
    serializeNode(node: any): any;
    serializeMark(mark: any): any;
}
