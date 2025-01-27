import { Action } from "@/actions/types";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { Editor } from "@tiptap/react";
import "../css/MenuItem.scss";

export default ({
  icon: Icon,
  title,
  action,
  isActive,
  editor,
}: Action & { editor: Editor }) => (
  <CustomTooltip title={title}>
    <span
      className={`menu-item${isActive && isActive(editor) ? " is-active" : ""}`}
      onClick={() => {
        action?.(editor);
      }}
    >
      {<Icon />}
    </span>
  </CustomTooltip>
);
