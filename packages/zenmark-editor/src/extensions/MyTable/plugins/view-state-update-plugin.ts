import xbook from "@/xbook";
import { EditorState, Plugin, PluginView } from "@tiptap/pm/state";
import { EditorView } from "prosemirror-view";
export const ViewStateUpdatePlugin = (editor) => {
  return new Plugin({
    view(view) {
      return new (class TooltipView implements PluginView {
        update(view: EditorView, prevState: EditorState) {
          //   console.log("TooltipView.update:", view, prevState);
          //   xbook.eventBus.emit("editor:view:update", { view, prevState });
          xbook.pipeService.emit("editor:view:update", {
            view,
            prevState,
          });
          xbook.pipeService.emit("editor", editor);
        }
      })();
    },
  });
};
