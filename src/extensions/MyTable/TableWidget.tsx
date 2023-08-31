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
import type { useWidgetViewFactory } from "@prosemirror-adapter/react";
addColumnAfter;
import {
  usePluginViewContext,
  useWidgetViewContext,
} from "@prosemirror-adapter/react";
import type { ComponentType, FC, ReactNode, ReactPortal } from "react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getCellsInColumn,
  getCellsInRow,
  selectCol,
  selectNodeCol,
  selectNodeRow,
  selectNodeTable,
  selectRow,
  selectTable,
} from "@/extensions/MyTable/utils";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import "./MyTable.scss";
import React from "react";
import { Editor } from "@tiptap/core";
import { TooltipProvider } from "@/extensions/MyTable/TooltipProvider";
import xbook from "@/xbook";
import { useStateFromPipe } from "@/extensions/MyTable/hooks/use-state-from-pipe";
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

const TableSelectorWidget: FC = ({ spec }: any) => {
  // const { spec } = useWidgetViewContext();
  const type = spec?.type;
  const index = spec?.index ?? 0;
  // console.log("spec:", spec);
  const editor = useStateFromPipe<Editor>("editor");
  const tooltip = useStateFromPipe(
    "tableTooltip",
    undefined as unknown as TooltipProvider
  );
  // console.log("tableTooltip:", tooltip);
  //   const [loading, getEditor] = useInstance();
  // editor.commands.addColumnAfter();
  const common = "cursor-pointer absolute bg-blue-200 hover:bg-blue-400";

  const className = useMemo(() => {
    if (type === "left") return "w-2 h-full -left-3.5 top-0";

    if (type === "top") return "right-px h-2 left-0 -top-3.5";

    return "h-3 w-3 -left-4 -top-4 rounded-full";
  }, [type]);

  return (
    <div
      draggable={type !== "top-left"}
      className={[className, common].join(" ")}
      onClick={(e) => {
        e.stopPropagation();
        // if (loading) return;

        const rect = (e.target as HTMLElement).getBoundingClientRect();
        tooltip?.getInstance()?.setProps({
          getReferenceClientRect: () => rect,
        });
        tooltip?.show();
        // console.log("top-left clicked");
        if (type === "left")
          editor?.view.dispatch(selectNodeRow(index)(editor?.state.tr));
        else if (type === "top")
          editor?.view.dispatch(selectNodeCol(index)(editor?.state.tr));
        else editor?.view.dispatch(selectNodeTable(editor?.state.tr));
        // getEditor().action((ctx) => {
        //   const tooltip = ctx.get(tableTooltipCtx.key);
        //   const rect = (e.target as HTMLElement).getBoundingClientRect();
        //   tooltip?.getInstance()?.setProps({
        //     getReferenceClientRect: () => rect,
        //   });
        //   tooltip?.show();
        //   const commands = ctx.get(commandsCtx);

        //   if (type === "left") commands.call(selectRowCommand.key, index);
        //   else if (type === "top") commands.call(selectColCommand.key, index);
        //   else commands.call(selectTableCommand.key);
        // });
      }}
      onDragStart={(e) => {
        e.stopPropagation();

        const data = { index: spec?.index, type: spec?.type };
        e.dataTransfer.setData(
          "application/milkdown-table-sort",
          JSON.stringify(data)
        );
        e.dataTransfer.effectAllowed = "move";
      }}
      onDragOver={(e) => {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
      onDrop={(e) => {
        if (type === "top-left") return;
        const i = spec?.index;
        // if (loading || i == null) return;
        const data = e.dataTransfer.getData("application/milkdown-table-sort");
        try {
          const { index, type } = JSON.parse(data);

          //   getEditor().action((ctx) => {
          //     const commands = ctx.get(commandsCtx);
          //     const options = {
          //       from: Number(index),
          //       to: i,
          //     };

          //     commands.call(
          //       type === "left" ? moveRowCommand.key : moveColCommand.key,
          //       options
          //     );
          //   });
        } catch {
          // ignore data from other source
        }
      }}
    />
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
