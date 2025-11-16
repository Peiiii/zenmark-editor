/* Copyright 2021, Milkdown by Mirone. */

// import { commandsCtx } from "@milkdown/core";
// import { TooltipProvider, tooltipFactory } from "@milkdown/plugin-tooltip";
// import {
//   addColAfterCommand,
//   addColBeforeCommand,
//   addRowAfterCommand,
//   addRowBeforeCommand,
//   deleteSelectedCellsCommand,
//   getCellsInColumn,
//   getCellsInRow,
//   moveColCommand,
//   moveRowCommand,
//   selectColCommand,
//   selectRowCommand,
//   selectTableCommand,
//   setAlignCommand,
// } from "@milkdown/preset-gfm";
import { EditorState, Plugin, PluginKey, PluginView } from "@tiptap/pm/state";
import { CellSelection, addColumnAfter } from "@tiptap/pm/tables";
import { Decoration, EditorView } from "@tiptap/pm/view";
import { DecorationSet } from "@tiptap/pm/view";
// import { useInstance } from "@milkdown/react";
// import { $ctx, $prose } from "@milkdown/utils";

import type { ComponentType, FC } from "react";
import {
  createContext,
  useMemo,
} from "react";
import {
  getCellsInColumn,
  getCellsInRow,
} from "@/extensions/MyTable/utils";
import { createRoot } from "react-dom/client";
import "./MyTable.scss";
import React from "react";
import { Editor } from "@tiptap/core";
import { TooltipProvider } from "@/extensions/MyTable/TooltipProvider";
import xbook from "@/xbook";
import { useStateFromPipe } from "@/extensions/MyTable/hooks/use-state-from-pipe";
import { useTableActionMenu } from "./hooks/useTableActionMenu";
import { TableActionMenu } from "./components/TableActionMenu";
import {
  getSelectorClassName,
  handleDragStart,
  handleDragOver,
  handleDrop,
} from "./utils/tableSelectorUtils";
export const editorContext = createContext<Editor>(
  undefined as unknown as Editor
);
export const tableTooltipContext = createContext<TooltipProvider | undefined>(
  undefined
);
// export const tableTooltipCtx = $ctx<TooltipProvider | null, "tableTooltip">(
//   null,
//   "tableTooltip"
// );

// export const tableTooltip = tooltipFactory("TABLE");

const TableSelectorWidget: FC<{ spec?: { type: string; index?: number } }> = ({
  spec = { type: "top-left" },
}) => {
  const type = spec?.type;
  const index = spec?.index ?? 0;
  const editor = useStateFromPipe<Editor>("editor");
  const tooltip = useStateFromPipe<TooltipProvider | undefined>(
    "tableTooltip",
    undefined as unknown as TooltipProvider
  );

  const {
    showMenu,
    menuPosition,
    menuRef,
    selectorRef,
    handleSelectorClick,
    closeMenu,
  } = useTableActionMenu({
    type: type as "left" | "top" | "top-left",
    index,
    editor,
    tooltip,
  });

  const className = useMemo(
    () => `${getSelectorClassName(type)} table-selector-${type}-${index}`,
    [type, index]
  );

  return (
    <>
    <div
      draggable={type !== "top-left"}
        className={className}
        ref={selectorRef}
        onClick={handleSelectorClick}
        onDragStart={(e) => handleDragStart(e, spec)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, type, spec?.index)}
      />
      {showMenu &&
        editor &&
        menuPosition &&
        (type === "left" || type === "top") && (
          <TableActionMenu
            type={type as "left" | "top"}
            editor={editor}
            position={menuPosition}
            onClose={closeMenu}
          />
        )}
    </>
  );
};
const createWidgetViewFactory =
  (editor) =>
  (params: { as: string; component: ComponentType<Record<string, any>> }) => {
    return (pos, userSpec) => {
      const { as, component: UserComponent } = params;
      let root;
      const spec = {
        ...userSpec,
        destroy: (node) => {
          root?.unmount();
        },
      };
      return Decoration.widget(
        pos,
        (view, getPos) => {
          const dom = document.createElement(as);
          const { type, index } = spec;
          root = createRoot(dom).render(
            <editorContext.Provider value={editor}>
              <UserComponent spec={{ type, index }} />
            </editorContext.Provider>
          );
          return dom;
        },
        spec
      );
    };
  };

export const tableSelectorPlugin = (editor: Editor) =>
  // widgetViewFactory: ReturnType<typeof useWidgetViewFactory>
  // $prose(() =>
  {
    // console.log("editor:", editor);
    const widgetViewFactory = createWidgetViewFactory(editor);
    const key = new PluginKey("MILKDOWN_TABLE_SELECTOR");
    return new Plugin({
      key,

      state: {
        init() {
          return DecorationSet.empty;
        },
        apply(tr) {
          const decorations: Decoration[] = [];
          const leftCells = getCellsInColumn(0, tr.selection);
          if (!leftCells) return null;
          const topCells = getCellsInRow(0, tr.selection);
          if (!topCells) return null;

          const createWidget = widgetViewFactory({
            as: "div",
            component: TableSelectorWidget,
          });

          const [topLeft] = leftCells;
          if (!topLeft) return null;

          decorations.push(createWidget(topLeft.pos + 1, { type: "top-left" }));
          leftCells.forEach((cell, index) => {
            decorations.push(
              createWidget(cell.pos + 1, { type: "left", index })
            );
          });
          topCells.forEach((cell, index) => {
            decorations.push(
              createWidget(cell.pos + 1, { type: "top", index })
            );
          });

          return DecorationSet.create(tr.doc, decorations);
        },
      },
      props: {
        decorations(state) {
          return key.getState(state);
        },
      },
    });
  };
