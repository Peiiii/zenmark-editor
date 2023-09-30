import { useCallback, useState } from "react";
import "../css/CodeBlockComponent.scss";

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

export default ({
  node: {
    attrs: { language },
  },
  updateAttributes,
  extension,
}) => {
  return (
    <NodeViewWrapper className="code-block">
      <pre>
        <div className="bar">
          <select
            className="language-select"
            contentEditable={false}
            style={{ width:`${ (language || "").length/2 + 2}em` }}
            // defaultValue={defaultLanguage}
            value={language}
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
        </div>
        <div className="code-wrapper">
          <NodeViewContent as="code" />
        </div>
      </pre>
    </NodeViewWrapper>
  );
};
