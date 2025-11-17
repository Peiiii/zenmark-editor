import { Editor} from "@tiptap/react";
import { css } from "@emotion/css";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
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

function shouldShowBubbleMenu(editor: Editor): boolean {
  const { state, view } = editor;
  const { selection } = state as any;

  if (selection instanceof CellSelection) {
    return false;
  }

  const { from, to } = selection;
  if (from === to) {
    return false;
  }

  try {
    const domAtPos = view.domAtPos(from);
    const node = (domAtPos as any).node as HTMLElement;

    if (node) {
      const isTableSelector =
        node.closest?.('[class*="table-selector-"]') ||
        node.closest?.(".table-row-column-menu") ||
        (node.classList &&
          (Array.from(node.classList).some((cls: string) =>
            cls.startsWith("table-selector-")
          ) ||
            node.classList.contains("table-row-column-menu")));
      if (isTableSelector) {
        return false;
      }

      const parent = node.parentElement;
      if (parent) {
        const isParentTableSelector =
          parent.closest?.('[class*="table-selector-"]') ||
          parent.closest?.(".table-row-column-menu");
        if (isParentTableSelector) {
          return false;
        }
      }
    }
  } catch (e) {
    return true;
  }

  return true;
}

function getSelectionClientRect(editor: Editor): DOMRect | null {
  const { state, view } = editor;
  const { from, to } = state.selection as any;
  try {
    const start = view.coordsAtPos(from);
    const end = view.coordsAtPos(to);
    const top = Math.min(start.top, end.top);
    const bottom = Math.max(start.bottom ?? start.top, end.bottom ?? end.top);
    const left = (start.left + end.left) / 2;
    const height = Math.max(0, bottom - top);
    return new DOMRect(left, top, 0, height);
  } catch {
    return null;
  }
}

function getEditorHeaderRect(editor: Editor): DOMRect | null {
  const root = (editor.view.dom.closest?.(".editor") as HTMLElement) || editor.view.dom.parentElement;
  const header = root?.querySelector?.(".editor-header") as HTMLElement | null;
  if (!header) return null;
  try {
    return header.getBoundingClientRect();
  } catch {
    return null;
  }
}

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

  // Track visibility and position for a simple fixed-position overlay.
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [placement, setPlacement] = useState<'top' | 'bottom'>('top');
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!editor) return;
    const update = () => {
      const show = shouldShowBubbleMenu(editor);
      if (!show) {
        setVisible(false);
        return;
      }
      const rect = getSelectionClientRect(editor);
      if (!rect) {
        setVisible(false);
        return;
      }
      // Decide placement to avoid overlapping the header if needed
      const headerRect = getEditorHeaderRect(editor);
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
      setVisible(true);
    };

    // Initial render and subscribe to relevant events.
    update();
    editor.on("selectionUpdate", update);
    editor.on("focus", update);
    editor.on("blur", update);
    editor.on("transaction", update);

    const onWindow = () => update();
    window.addEventListener("scroll", onWindow, true);
    window.addEventListener("resize", onWindow, true);
    return () => {
      editor?.off("selectionUpdate", update as any);
      editor?.off("focus", update as any);
      editor?.off("blur", update as any);
      editor?.off("transaction", update as any);
      window.removeEventListener("scroll", onWindow, true);
      window.removeEventListener("resize", onWindow, true);
    };
  }, [editor]);

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
