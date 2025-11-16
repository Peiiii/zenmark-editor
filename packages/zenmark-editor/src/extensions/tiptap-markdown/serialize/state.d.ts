/**
 * Override default MarkdownSerializerState to:
 * - handle commonmark delimiters (https://spec.commonmark.org/0.29/#left-flanking-delimiter-run)
 */
export class MarkdownSerializerState extends BaseMarkdownSerializerState {
    constructor(nodes: any, marks: any, options: any);
    inlines: any[];
    render(node: any, parent: any, index: any): void;
    out: any;
    markString(mark: any, open: any, parent: any, index: any): string;
    normalizeInline(inline: any): any;
}
import { MarkdownSerializerState as BaseMarkdownSerializerState } from "@tiptap/pm/markdown";
