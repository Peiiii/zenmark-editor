import { Editor} from "@tiptap/react";
import { css } from "@emotion/css";
import React, { Fragment, useMemo, useRef } from "react";
import { useSelectionViewport } from "../hooks/useSelectionViewport";
import { useBubbleMenuPosition } from "../hooks/useBubbleMenuPosition";
import { useElementSize } from "../hooks/useElementSize";
import { DEFAULT_BUBBLE_Z_INDEX } from "../config/ui";
import { CellSelection } from "@tiptap/pm/tables";
// import "../css/bubble-menu.scss";

import { Action } from "@/actions/types";
import PopMenu from "@/components/PopMenu";
import { Actions } from "../actions/editor";
import MenuItem from "./MenuItem";

const withId = (item: Action | Action[]) => {
  if (Array.isArray(item)) {
    return item.map(withId);
  }
  return { ...item, id: item.id || item.name || item.title };
};

// Selection visibility and geometry are handled by useSelectionViewport

export default ({ editor }: { editor: Editor }) => {
  const items: (Action | Action[])[] = useMemo(
    () =>
      [
        Actions.Bold,
        Actions.Italic,
        Actions.Strikethrough,
        // Actions.CodeView,
        // Actions.MarkPenLine,
        // Actions.H1,
        // Actions.H2,
        // Actions.BulletList,
        // Actions.OrderedList,
        // Actions.TaskList,
        // Actions.CodeBoxLine,
        // Actions.DoubleQuotes1,
        Actions.EditLink,
        Actions.FormatClear,
        // Actions.Divider,
        // Actions.AlignLeft
        // [Actions.AlignLeft, Actions.AlignCenter, Actions.AlignRight],
        // Actions.AddTableColumnBefore,
        // Actions.AddTableColumnAfter,
        // Actions.AddTableRowBefore,
        // Actions.AddTableRowAfter,
      ].map(withId),
    []
  );

  const menuRef = useRef<HTMLDivElement | null>(null);

  const { rect, visible } = useSelectionViewport(editor);
  const { height } = useElementSize(menuRef as any);
  const { pos, placement } = useBubbleMenuPosition(editor, rect, visible, menuRef as any, 8, height);

  if (!visible) return null;

  return (
    <div
      ref={menuRef}
      className="zenmark-bubble-menu"
      style={{
        position: "fixed",
        top: placement === 'top' ? Math.max(0, pos.y - 8) : pos.y + 8,
        left: pos.x,
        transform: placement === 'top' ? "translate(-50%, -100%)" : "translate(-50%, 0%)",
        transformOrigin: placement === 'top' ? '50% 100%' : '50% 0%',
        transition: 'none',
        zIndex: DEFAULT_BUBBLE_Z_INDEX,
      }}
      onMouseDown={(e) => {
        // Keep editor focused while interacting with the menu
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div
        className={css`
          display: flex;
        `}
      >
        {items.map((item, index) => {
          if (Array.isArray(item)) {
            // return <MenuItemSelect key={index} items={item} editor={editor} />;
            return <PopMenu key={index} items={item} editor={editor} />;
          } else {
            return (
              <Fragment key={index}>
                {item.type === "divider" ? (
                  <div className="zenmark-divider" />
                ) : (
                  <MenuItem editor={editor} {...item} />
                )}
              </Fragment>
            );
          }
        })}
      </div>
    </div>
  );
};
