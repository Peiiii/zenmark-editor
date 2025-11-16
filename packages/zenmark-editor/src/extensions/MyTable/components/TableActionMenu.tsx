import { FC } from "react";
import { Editor } from "@tiptap/core";
import { createPortal } from "react-dom";
import { MenuPosition } from "../hooks/useTableActionMenu";
import "../MyTable.scss";

interface TableActionMenuProps {
  type: "left" | "top";
  editor: Editor;
  position: MenuPosition;
  onClose: () => void;
}

const ActionButton: FC<{
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  variant?: "danger" | "default";
}> = ({ onClick, title, children, variant = "default" }) => {
  return (
    <button
      className={`table-action-btn ${variant === "danger" ? "danger" : ""}`}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
};

export const TableActionMenu: FC<TableActionMenuProps> = ({
  type,
  editor,
  position,
  onClose,
}) => {
  const menuStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 1000,
    backgroundColor: "white",
    borderRadius: "6px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    padding: "4px",
    display: "flex",
    gap: "2px",
    ...(type === "left"
      ? {
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translateY(-50%)",
          whiteSpace: "nowrap",
        }
      : {
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translateX(-50%)",
          whiteSpace: "nowrap",
        }),
  };

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return createPortal(
    <div
      className="table-row-column-menu"
      style={menuStyle}
      onClick={(e) => e.stopPropagation()}
    >
      {type === "left" && (
        <>
          <ActionButton
            onClick={() =>
              handleAction(() => editor.chain().focus().addRowBefore().run())
            }
            title="在上方插入行"
          >
            +↑
          </ActionButton>
          <ActionButton
            onClick={() =>
              handleAction(() => editor.chain().focus().addRowAfter().run())
            }
            title="在下方插入行"
          >
            +↓
          </ActionButton>
          <ActionButton
            onClick={() =>
              handleAction(() => editor.chain().focus().deleteRow().run())
            }
            title="删除行"
            variant="danger"
          >
            ×
          </ActionButton>
        </>
      )}
      {type === "top" && (
        <>
          <ActionButton
            onClick={() =>
              handleAction(() => editor.chain().focus().addColumnBefore().run())
            }
            title="在左侧插入列"
          >
            +←
          </ActionButton>
          <ActionButton
            onClick={() =>
              handleAction(() => editor.chain().focus().addColumnAfter().run())
            }
            title="在右侧插入列"
          >
            +→
          </ActionButton>
          <ActionButton
            onClick={() =>
              handleAction(() => editor.chain().focus().deleteColumn().run())
            }
            title="删除列"
            variant="danger"
          >
            ×
          </ActionButton>
          <div className="table-action-divider" />
          <ActionButton
            onClick={() =>
              editor.chain().focus().setCellAttribute("textAlign", "left").run()
            }
            title="左对齐"
          >
            ⬅
          </ActionButton>
          <ActionButton
            onClick={() =>
              editor.chain()
                .focus()
                .setCellAttribute("textAlign", "center")
                .run()
            }
            title="居中"
          >
            ⬌
          </ActionButton>
          <ActionButton
            onClick={() =>
              editor.chain()
                .focus()
                .setCellAttribute("textAlign", "right")
                .run()
            }
            title="右对齐"
          >
            ➡
          </ActionButton>
        </>
      )}
    </div>,
    document.body
  );
};

