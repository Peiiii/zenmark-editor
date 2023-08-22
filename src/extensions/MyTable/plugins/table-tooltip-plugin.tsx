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
import { Plugin, PluginView } from "@tiptap/pm/state";
import { CellSelection, addColumnAfter } from "@tiptap/pm/tables";
// import { useInstance } from "@milkdown/react";
// import { $ctx, $prose } from "@milkdown/utils";
import { TooltipProvider } from "@/extensions/MyTable/TooltipProvider";
import xbook from "@/xbook";
import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Editor } from "@tiptap/react";
import { useStateFromPipe } from "@/extensions/MyTable/hooks/use-state-from-pipe";

export const TableTooltip: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { view, prevState } = useStateFromPipe<{ view: any; prevState: any }>(
    "editor:view:update",
    {
      view: null,
      prevState: null,
    }
  )!;
  const editor = useStateFromPipe<Editor>(
    "editor",
    undefined as unknown as Editor
  );

  //   console.log("editor:", editor);

  const tooltipProvider = useRef<TooltipProvider>();

  // const [loading, getEditor] = useInstance();
  // const loading = !editor;

  const isRow =
    view &&
    view.state.selection instanceof CellSelection &&
    view.state.selection.isRowSelection();
  const isCol =
    view &&
    view.state.selection instanceof CellSelection &&
    view.state.selection.isColSelection();
  const isWholeTable = isRow && isCol;
  const isHeading =
    view &&
    isRow &&
    view.state.doc.nodeAt((view.state.selection as CellSelection).$headCell.pos)
      ?.type.name === "table_header";

  useEffect(() => {
    if (ref.current && editor) {
      if (!tooltipProvider.current) {
        const provider = new TooltipProvider({
          content: ref.current,
          shouldShow: () => {
            return false;
          },
        });
        provider.update(view, prevState);
        tooltipProvider.current = provider;
        // console.log("emit tableTooltip:", provider);
        xbook.pipeService.emit("tableTooltip", provider);
      }
    }
    return () => {
      tooltipProvider.current?.destroy();
      tooltipProvider.current = undefined;
      xbook.pipeService.emit("tableTooltip", undefined);
    };
  }, [ref.current, editor, view, prevState]);

  return (
    <>
      {editor && (
        <div className="flex" ref={ref}>
          {!isWholeTable && !isHeading && isRow && (
            <button
              className="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-offset-2"
              onClick={() => {
                // if (loading) return;
                // getEditor().action((ctx) => {
                //   ctx.get(commandsCtx).call(addRowBeforeCommand.key);
                // });
                // tooltipProvider.current?.hide();
              }}
            >
              +Row
            </button>
          )}
          {!isWholeTable && isCol && (
            <button
              className="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-offset-2"
              onClick={() => {
                // if (loading) return;
                // getEditor().action((ctx) => {
                //   ctx.get(commandsCtx).call(addColBeforeCommand.key);
                // });
                // tooltipProvider.current?.hide();
              }}
            >
              +Col
            </button>
          )}
          {(isWholeTable || !isHeading) && (
            <button
              className="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-offset-2"
              onClick={() => {
                // if (loading) return;
                // getEditor().action((ctx) => {
                //   ctx.get(commandsCtx).call(deleteSelectedCellsCommand.key);
                // });
                // tooltipProvider.current?.hide();
              }}
            >
              Delete
            </button>
          )}
          {!isWholeTable && isRow && (
            <button
              className="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-offset-2"
              onClick={() => {
                // if (loading) return;
                // getEditor().action((ctx) => {
                //   ctx.get(commandsCtx).call(addRowAfterCommand.key);
                // });
                // tooltipProvider.current?.hide();
              }}
            >
              Row+
            </button>
          )}
          {!isWholeTable && isCol && (
            <button
              className="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-offset-2"
              onClick={() => {
                // if (loading) return;
                // getEditor().action((ctx) => {
                //   ctx.get(commandsCtx).call(addColAfterCommand.key);
                // });
                // tooltipProvider.current?.hide();
              }}
            >
              Col+
            </button>
          )}
          {!isWholeTable && isCol && (
            <button
              className="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-offset-2"
              onClick={() => {
                // if (loading) return;
                // getEditor().action((ctx) => {
                //   ctx.get(commandsCtx).call(setAlignCommand.key, "left");
                // });
              }}
            >
              Left
            </button>
          )}
          {!isWholeTable && isCol && (
            <button
              className="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-offset-2"
              onClick={() => {
                // if (loading) return;
                // getEditor().action((ctx) => {
                //   ctx.get(commandsCtx).call(setAlignCommand.key, "center");
                // });
              }}
            >
              Center
            </button>
          )}
          {!isWholeTable && isCol && (
            <button
              className="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-offset-2"
              onClick={() => {
                // if (loading) return;
                // getEditor().action((ctx) => {
                //   ctx.get(commandsCtx).call(setAlignCommand.key, "right");
                // });
              }}
            >
              Right
            </button>
          )}
        </div>
      )}
    </>
  );
};

export const TableTooltipPlugin = () => {
  return new Plugin({
    view() {
      return new (class TableTooltipPluginView implements PluginView {
        root: ReturnType<typeof createRoot>;
        constructor() {
          const getOrCreateGlobalContainer = (id: string) => {
            if (!document.getElementById(id)) {
              const dom = document.createElement("div");
              dom.id = id;
              document.body.appendChild(dom);
            }
            return document.getElementById(id)!;
          };
          this.root = createRoot(
            getOrCreateGlobalContainer("tableTooltipWrapper")
          );
          this.root.render(<TableTooltip />);
        }
        destroy() {
          // console.log("destroy...");
          this.root.unmount();
        }
      })();
    },
  });
};
