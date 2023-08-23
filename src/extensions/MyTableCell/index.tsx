import { mergeAttributes, Node } from "@tiptap/core";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { EditorState, Plugin, PluginView } from "@tiptap/pm/state";
import {
  Decoration,
  DecorationSet,
  DecorationSource,
  EditorView,
  NodeView,
} from "@tiptap/pm/view";
export interface TableCellOptions {
  HTMLAttributes: Record<string, any>;
}

export const MyTableCell = Node.create<TableCellOptions>({
  name: "tableCell",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  content: "block+",

  addAttributes() {
    return {
      colspan: {
        default: 1,
      },
      rowspan: {
        default: 1,
      },
      colwidth: {
        default: null,
        parseHTML: (element) => {
          const colwidth = element.getAttribute("colwidth");
          const value = colwidth ? [parseInt(colwidth, 10)] : null;

          return value;
        },
      },
    };
  },

  tableRole: "cell",

  isolating: true,

  parseHTML() {
    return [{ tag: "td" }];
  },
  addProseMirrorPlugins() {
    return [
      // new Plugin({
      //   view(view) {
      //     return new (class MyView implements PluginView {
      //       update(view: EditorView, prevState: EditorState) {
      //         const { $from, $to, ranges } = view.state.selection;
      //         for (let i = 0; i < ranges.length; i++) {
      //           const { $from, $to } = ranges[i];
      //           const fromNode = view.state.doc.nodeAt($from.pos);
      //           const toNode = view.state.doc.nodeAt($to.pos);
      //           // console.log(
      //           //   "$from:",
      //           //   $from,
      //           //   "$to:",
      //           //   $to,
      //           //   "fromNode:",
      //           //   fromNode,
      //           //   "toNode:",
      //           //   toNode
      //           // );
      //         }
      //         //   console.log("selection:", view.state.selection);
      //         //   console.log("dom:", view.dom);
      //         //   view.domAtPos();
      //       }
      //     })();
      //   },
      // }),
    ];
  },

  // addNodeView() {
  //   const options = this.options;
  //   return ({ editor, HTMLAttributes, getPos }) =>
  //     new (class MyView implements NodeView {
  //       dom: HTMLElement;
  //       contentDOM: HTMLElement;
  //       constructor() {
  //         const attributes = mergeAttributes(
  //           options.HTMLAttributes,
  //           HTMLAttributes
  //         );
  //         this.dom = document.createElement("td");
  //         Object.assign(this.dom, attributes);
  //         this.contentDOM = this.dom;
  //       }
  //       update(
  //         node: ProseMirrorNode,
  //         decorations: readonly Decoration[],
  //         innerDecorations: DecorationSource
  //       ) {
  //         console.log(
  //           "cell node pose:",
  //           typeof getPos === "function" ? getPos() : getPos
  //         );
  //         //   const { $from, $to } = editor.state.selection;

  //         //   console.log(
  //         //     "$from:",
  //         //     $from,
  //         //     "$to:",
  //         //     $to,
  //         //     "nodePos:",
  //         //     typeof getPos === "function" ? getPos() : getPos
  //         //   );
  //         return false;
  //       }
  //     })();
  // },
  renderHTML({ node, HTMLAttributes }) {
    return [
      "td",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
});
