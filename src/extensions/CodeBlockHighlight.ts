import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { EditorContent, ReactNodeViewRenderer, useEditor } from '@tiptap/react'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
// load all highlight.js languages
import { lowlight } from 'lowlight'

import CodeBlockComponent from './CodeBlockComponent'

lowlight.registerLanguage('html', html)
lowlight.registerLanguage('css', css)
lowlight.registerLanguage('js', js)
lowlight.registerLanguage('ts', ts)

export const CodeBlockHighlight = CodeBlockLowlight
    .extend({
        addNodeView() {
            return ReactNodeViewRenderer(CodeBlockComponent)
        },
    })
    .configure({ lowlight });
