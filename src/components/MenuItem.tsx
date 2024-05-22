import { Action } from "@/actions/types";
import { Editor } from "@tiptap/react";
import "../css/MenuItem.scss";

export default ({
  icon: Icon,
  title,
  action,
  isActive,
  editor,
}: Action & { editor: Editor }) => (
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
