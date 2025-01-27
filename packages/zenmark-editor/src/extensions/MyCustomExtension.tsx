import { Editor, Extension, Node } from "@tiptap/react";
import { EditorState, Plugin, PluginView } from "@tiptap/pm/state";
import { EditorView } from "@tiptap/pm/view";

class MyCustomView implements PluginView {
  view: EditorView;
  editor: Editor;
  constructor({ view, editor }: { view: EditorView; editor: Editor }) {
    this.view = view;
    this.editor = editor;
    // this.dom=
  }
  update(view: EditorView, prevState: EditorState) {}
  destroy?: (() => void) | undefined;
}
const MyCustomPlugin = ({ editor }) => {
  return new Plugin({
    name: "my-custom-extension",
    view(view) {
      return new MyCustomView({ view, editor });
    },
  });
};
export default Extension.create({
  name: "my-custom-extension",
  addProseMirrorPlugins() {
    return [
      MyCustomPlugin({
        editor: this.editor,
      }),
    ];
  },
});
