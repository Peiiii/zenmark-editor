import { Editor } from "@tiptap/react";
import "../css/MenuItem.scss";

export default ({
  icon: Icon,
  title,
  action,
  isActive,
  editor,
}: {
  icon: any;
  title?: string;
  action?: (editor: Editor) => void;
  isActive?: (editor: Editor) => boolean;
  editor: Editor;
}) => (
  <span
    className={`menu-item${isActive && isActive(editor) ? " is-active" : ""}`}
    onClick={() => {
      action?.(editor);
    }}
    title={title}
  >
    {<Icon />}
  </span>
);
