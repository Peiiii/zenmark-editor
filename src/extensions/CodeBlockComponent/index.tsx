import { useEffect, useState } from "react";
import "../../css/CodeBlockComponent.scss";

import { copyToClipboard } from "@/common/copyToClipboard";
import LanguageSelect from "@/extensions/CodeBlockComponent/LanguageSelect";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

export default ({ node, updateAttributes, extension }) => {
  const {
    attrs: { language, ...rest },
  } = node;
  const [copied, setCopied] = useState(false);
  const code = node.content.content[0]?.text;
  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 3 * 1000);
    }
  }, [copied]);
  return (
    <NodeViewWrapper className="code-block hover-action">
      <pre>
        <div className="bar">
          <LanguageSelect
            value={language || "auto"}
            onChange={(e) => {
              updateAttributes({ language: e.target.value });
            }}
            languages={extension.options.lowlight.listLanguages()}
          />
          <div className="right hover-visible">
            {copied ? (
              <div className="copied-text" style={{ color: "gray" }}>
                Copied!
              </div>
            ) : (
              <div
                className="copy-button"
                onClick={() => {
                  copyToClipboard(code);
                  setCopied(true);
                }}
              >
                Copy
              </div>
            )}
          </div>
        </div>
        <div className="code-wrapper">
          <NodeViewContent as="code" style={{ whiteSpace: "pre" }} />
        </div>
      </pre>
    </NodeViewWrapper>
  );
};
