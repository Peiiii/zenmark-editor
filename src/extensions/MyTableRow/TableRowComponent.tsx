import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { useEffect, useRef } from "react";

export default ({ node: {}, updateAttributes, extension }) => {
  return (
    <NodeViewWrapper as="tr">
      {/* <tr> */}
      <NodeViewContent />
      {/* </tr> */}
    </NodeViewWrapper>
  );
};
