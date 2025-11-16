import { Editor, Extension } from "@tiptap/core";
import { Plugin, PluginView } from "@tiptap/pm/state";

class MyCustomView implements PluginView {
  view: any;
  editor: Editor;
  constructor({ view, editor }: { view: any; editor: Editor }) {
    this.view = view;
    this.editor = editor;
    // this.dom=
  }
  update(view: any, prevState: any) {}
  destroy?: (() => void) | undefined;
}
const MyCustomPlugin = ({ editor }) => {
  return new Plugin({
    name: "my-custom-extension",
    view(view: any) {
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
