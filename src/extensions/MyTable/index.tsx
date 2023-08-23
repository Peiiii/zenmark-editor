import { TableComponent } from "@/extensions/MyTable/TableComponent";
import { TableView } from "@/extensions/MyTable/TableView";
import { tableSelectorPlugin } from "@/extensions/MyTable/TableWidget";
import { TableTooltipPlugin } from "@/extensions/MyTable/plugins/table-tooltip-plugin";
import { ViewStateUpdatePlugin } from "@/extensions/MyTable/plugins/view-state-update-plugin";
import Table from "@tiptap/extension-table";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Plugin } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "prosemirror-view";
export default Table.extend({
  // addNodeView() {
  //   // return ReactNodeViewRenderer(TableComponent)
  //   return ({ node }) => new TableView(node, 30);
  // },
  addProseMirrorPlugins() {
    const editor = this.editor;
    return [
      new Plugin({
        props: {
          decorations(state) {
            const { ranges } = state.selection;
            // console.log("ranges: ", ranges);
            if (!ranges.length) return DecorationSet.empty;
            const decs: Decoration[] = [];
            for (let i = 0; i < ranges.length; i++) {
              const { $from, $to } = ranges[i];
              if ($from.pos === $to.pos) continue;
              const wrapperNode =
                $from.pos - 1 >= 0
                  ? editor.state.doc.nodeAt($from.pos - 1)
                  : null;
              // console.log("wrapperNode:", wrapperNode);
              if (
                wrapperNode &&
                ["tableCell", "tableHeader"].includes(wrapperNode.type.name)
              ) {
                decs.push(
                  Decoration.node($from.pos - 1, $to.pos + 1, {
                    class: "selected",
                  })
                );
              }
              const selectedNode = editor.state.doc.nodeAt($from.pos);
              console.log("wrapperNode:", wrapperNode);
              if (
                selectedNode &&
                ["tableCell", "tableHeader"].includes(selectedNode.type.name)
              ) {
                decs.push(
                  Decoration.node($from.pos, $to.pos, {
                    class: "selected",
                  })
                );
              }
            }
            return DecorationSet.create(state.doc, decs);
          },
        },
      }),
      ViewStateUpdatePlugin(this.editor),
      TableTooltipPlugin(),
      tableSelectorPlugin(this.editor),
    ];
  },
});
