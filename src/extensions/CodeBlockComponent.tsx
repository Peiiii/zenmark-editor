import '../css/CodeBlockComponent.scss'

import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'

export default ({ node: { attrs: { language: defaultLanguage } }, updateAttributes, extension }) => (
  <NodeViewWrapper className="code-block">
  
    <pre>
    <div className="bar">
   <select contentEditable={false} defaultValue={defaultLanguage} onChange={event => updateAttributes({ language: event.target.value })}>
      <option value="null">
        auto
      </option>
      <option disabled>
        —
      </option>
      {extension.options.lowlight.listLanguages().map((lang, index) => (
        <option key={index} value={lang}>
          {lang}
        </option>
      ))}
    </select>
   </div>

      <NodeViewContent as="code" />
    </pre>
  </NodeViewWrapper>
)