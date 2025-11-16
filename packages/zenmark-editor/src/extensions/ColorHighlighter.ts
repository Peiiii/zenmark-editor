import "../css/ColorHighlighter.scss";
import { Extension } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'

import findColors from './findColors';

export const ColorHighlighter = Extension.create({
  name: 'colorHighlighter',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        state: {
          init(_, { doc }) {
            return findColors(doc as any) as any
          },
          apply(transaction, oldState) {
            return transaction.docChanged ? (findColors(transaction.doc as any) as any) : oldState
          },
        },
        props: {
          decorations(state) {
            return (this.getState(state) as any)
          },
        },
      }),
    ]
  },
})
