import { Plugin, PluginKey } from "@tiptap/pm/state";
import { CellSelection, TableMap } from "@tiptap/pm/tables";
import { findParentNode } from "@tiptap/react";

export const TableKeyboardPlugin = () => {
  return new Plugin({
    key: new PluginKey("tableKeyboard"),
    props: {
      handleKeyDown(view, event) {
        const { selection, doc } = view.state;

        const table = findParentNode(
          (node) => node.type.spec.tableRole === "table"
        )(selection);

        if (!table) {
          return false;
        }

        const isInTable = table.node;
        const isCellSelection = selection instanceof CellSelection;

        if (event.key === "Tab") {
          event.preventDefault();
          
          if (isCellSelection) {
            const { $headCell } = selection as CellSelection;
            const tableMap = TableMap.get(isInTable);
            const currentCell = tableMap.findCell($headCell.pos - table.start);
            
            if (currentCell) {
              const row = currentCell.top;
              const col = currentCell.left;
              let nextRow = row;
              let nextCol = col;
              
              if (!event.shiftKey) {
                if (col < tableMap.width - 1) {
                  nextCol = col + 1;
                } else if (row < tableMap.height - 1) {
                  nextRow = row + 1;
                  nextCol = 0;
                } else {
                  return true;
                }
              } else {
                if (col > 0) {
                  nextCol = col - 1;
                } else if (row > 0) {
                  nextRow = row - 1;
                  nextCol = tableMap.width - 1;
                } else {
                  return true;
                }
              }
              
              const nextCellPos = table.start + tableMap.positionAt(nextRow, nextCol, isInTable);
              const $nextCell = doc.resolve(nextCellPos);
              view.dispatch(
                view.state.tr.setSelection(
                  CellSelection.create(doc, $nextCell.pos)
                )
              );
              return true;
            }
          } else {
            const cell = findParentNode(
              (node) =>
                node.type.spec.tableRole === "cell" ||
                node.type.spec.tableRole === "header_cell"
            )(selection);
            
            if (cell) {
              const tableMap = TableMap.get(isInTable);
              const cellPos = cell.pos - table.start + 1;
              const currentCell = tableMap.findCell(cellPos);
              
              if (currentCell) {
                const row = currentCell.top;
                const col = currentCell.left;
                let nextRow = row;
                let nextCol = col;
                
                if (!event.shiftKey) {
                  if (col < tableMap.width - 1) {
                    nextCol = col + 1;
                  } else if (row < tableMap.height - 1) {
                    nextRow = row + 1;
                    nextCol = 0;
                  } else {
                    return true;
                  }
                } else {
                  if (col > 0) {
                    nextCol = col - 1;
                  } else if (row > 0) {
                    nextRow = row - 1;
                    nextCol = tableMap.width - 1;
                  } else {
                    return true;
                  }
                }
                
                const nextCellPos = table.start + tableMap.positionAt(nextRow, nextCol, isInTable);
                const $nextCell = doc.resolve(nextCellPos);
                view.dispatch(
                  view.state.tr.setSelection(
                    CellSelection.create(doc, $nextCell.pos)
                  )
                );
                return true;
              }
            }
          }
        }

        return false;
      },
    },
  });
};

