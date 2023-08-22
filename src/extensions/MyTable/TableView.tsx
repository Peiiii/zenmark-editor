// @ts-nocheck
import { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { NodeView } from "@tiptap/pm/view";

export function updateColumns(
  node: ProseMirrorNode,
  colgroup: Element,
  table: Element,
  cellMinWidth: number,
  overrideCol?: number,
  overrideValue?: any
) {
  let totalWidth = 0;
  let fixedWidth = true;
  let nextDOM = colgroup.firstChild;
  const row = node.firstChild;

  for (let i = 0, col = 0; i < row.childCount; i += 1) {
    const { colspan, colwidth } = row.child(i).attrs;

    for (let j = 0; j < colspan; j += 1, col += 1) {
      const hasWidth =
        overrideCol === col ? overrideValue : colwidth && colwidth[j];
      const cssWidth = hasWidth ? `${hasWidth}px` : "";

      totalWidth += hasWidth || cellMinWidth;

      if (!hasWidth) {
        fixedWidth = false;
      }

      if (!nextDOM) {
        colgroup.appendChild(document.createElement("col")).style.width =
          cssWidth;
      } else {
        if (nextDOM.style.width !== cssWidth) {
          nextDOM.style.width = cssWidth;
        }

        nextDOM = nextDOM.nextSibling;
      }
    }
  }

  while (nextDOM) {
    const after = nextDOM.nextSibling;

    nextDOM.parentNode.removeChild(nextDOM);
    nextDOM = after;
  }

  if (fixedWidth) {
    table.style.width = `${totalWidth}px`;
    table.style.minWidth = "";
  } else {
    table.style.width = "";
    table.style.minWidth = `${totalWidth}px`;
  }
}
const addTableEditorWidgets = (node: ProseMirrorNode, dom: HTMLElement) => {
  const thList = dom.getElementsByTagName("th");
  console.log(thList);
  for (let i = 0; i < thList.length; i++) {
    const th = thList[i];
    const barWrapper = document.createElement("div");
    barWrapper.className = "barWrapper";
    barWrapper.style.position = "absolute";
    barWrapper.style.width = "100%";
    barWrapper.style.height = "0";
    th.prepend(barWrapper);
    const bar = barWrapper.appendChild(document.createElement("div"));
    bar.style.position = "relative";
    bar.style.bottom = "20px";
    bar.style.height = "10px";
    bar.style.backgroundColor = "#e5e7eb";
    console.log("th:", th);
  }
};

export class TableView implements NodeView {
  node: ProseMirrorNode;

  cellMinWidth: number;

  dom: Element;

  table: Element;

  colgroup: Element;

  contentDOM: Element;

  constructor(node: ProseMirrorNode, cellMinWidth: number) {
    this.node = node;
    this.cellMinWidth = cellMinWidth;
    this.dom = document.createElement("div");
    this.dom.className = "tableWrapper";
    this.table = this.dom.appendChild(document.createElement("table"));
    this.colgroup = this.table.appendChild(document.createElement("colgroup"));
    updateColumns(node, this.colgroup, this.table, cellMinWidth);
    this.contentDOM = this.table.appendChild(document.createElement("tbody"));
    this.dom.addEventListener("mouseover", () => {
      console.log("hi");
      addTableEditorWidgets(node, this.dom);
    });
  }

  update(node: ProseMirrorNode) {
    if (node.type !== this.node.type) {
      return false;
    }

    this.node = node;
    addTableEditorWidgets(node, this.dom);
    updateColumns(node, this.colgroup, this.table, this.cellMinWidth);
    return true;
  }

  ignoreMutation(
    mutation: MutationRecord | { type: "selection"; target: Element }
  ) {
    return (
      mutation.type === "attributes" &&
      (mutation.target === this.table ||
        this.colgroup.contains(mutation.target))
    );
  }
}
