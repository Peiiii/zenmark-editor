import { useEffect, useState } from "react";
import "../css/CodeBlockComponent.scss";

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { copyToClipboard } from "@/common/copyToClipboard";

export default ({ node, updateAttributes, extension }) => {
  const {
    attrs: { language, ...rest },
  } = node;
  const value = language || "null";
  const [copied, setCopied] = useState(false);
  // console.log("node:", node);
  const code = node.content.content[0]?.text;
  // console.log("code:",code)
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
          <select
            className="language-select"
            contentEditable={false}
            style={{ width: `${value.length / 2 + 2}em` }}
            // defaultValue={defaultLanguage}
            value={value}
            onChange={(event) =>
              updateAttributes({ language: event.target.value })
            }
          >
            <option className="language-option" value="null">
              auto
            </option>
            <option className="language-option" disabled>
              —
            </option>
            {extension.options.lowlight.listLanguages().map((lang, index) => (
              <option className="language-option" key={index} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <div className="right hover-visible">
            {copied ? (
              <span className="copied-text" style={{ color: "gray" }}>Copied!</span>
            ) : (
              <button
                className="copy-button"
                onClick={() => {
                  copyToClipboard(code);
                  setCopied(true);
                }}
              >Copy</button>
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
