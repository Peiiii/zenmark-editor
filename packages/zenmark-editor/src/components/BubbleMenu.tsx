import { Editor} from "@tiptap/react";
import { css } from "@emotion/css";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { getEditorHeaderRect } from "../utils/bubble";
import { useSelectionViewport } from "../hooks/useSelectionViewport";
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

  // Track position for a simple fixed-position overlay.
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [placement, setPlacement] = useState<'top' | 'bottom'>('top');
  const menuRef = useRef<HTMLDivElement | null>(null);

  const { rect, visible } = useSelectionViewport(editor);

  useEffect(() => {
    if (!editor) return;
    const update = () => {
      if (!visible || !rect) return;
      // Decide placement to avoid overlapping the header if needed
      const headerRect = getEditorHeaderRect(editor.view as any);
      const el = menuRef.current;
      const menuH = el?.offsetHeight || 36;
      const offset = 8;
      const topY = rect.top;
      const bottomY = rect.top + rect.height;
      const topFitsViewport = topY - offset - menuH >= 0;
      const bottomFitsViewport = bottomY + offset + menuH <= window.innerHeight;

      let nextPlacement: 'top' | 'bottom' = 'top';
      if (headerRect) {
        const bubbleTopIfTop = topY - offset - menuH;
        const collidesHeader = bubbleTopIfTop < headerRect.bottom;
        if (collidesHeader && bottomFitsViewport) {
          nextPlacement = 'bottom';
        } else if (!topFitsViewport && bottomFitsViewport) {
          nextPlacement = 'bottom';
        } else if (topFitsViewport && !bottomFitsViewport) {
          nextPlacement = 'top';
        } else if (!topFitsViewport && !bottomFitsViewport) {
          nextPlacement = topY < window.innerHeight / 2 ? 'bottom' : 'top';
        }
      } else {
        if (!topFitsViewport && bottomFitsViewport) nextPlacement = 'bottom';
        else if (topFitsViewport && !bottomFitsViewport) nextPlacement = 'top';
        else if (!topFitsViewport && !bottomFitsViewport) nextPlacement = 'bottom';
      }

      setPlacement(nextPlacement);
      setPos({ x: rect.left, y: nextPlacement === 'top' ? topY : bottomY });
    };

    // Initial render and subscribe to relevant events.
    update();
    // Depend on rect/visible so we reposition in lockstep with selection hook
  }, [editor, rect, visible]);

  if (!visible) return null;

  return (
    <div
      ref={menuRef}
      className="bubble-menu"
      style={{
        position: "fixed",
        top: placement === 'top' ? Math.max(0, pos.y - 8) : pos.y + 8,
        left: pos.x,
        transform: placement === 'top' ? "translate(-50%, -100%)" : "translate(-50%, 0%)",
        transformOrigin: placement === 'top' ? '50% 100%' : '50% 0%',
        transition: 'none',
        zIndex: 99999,
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
                  <div className="divider" />
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
