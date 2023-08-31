import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { useEffect, useRef } from "react";

export const TableComponent = ({ node, updateAttributes, extension }) => {
  const dom = useRef<HTMLTableElement>(null);
  // console.log("table node:", node);
  useEffect(() => {
    if (dom.current) {
      // dom.current.on
    }
  }, [dom.current]);
  return (
    <NodeViewWrapper as="table">
      {/* <table> */}
      {/* <NodeViewContent /> */}
      {/* </table> */}
    </NodeViewWrapper>
  );
};
