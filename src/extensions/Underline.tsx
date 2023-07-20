import {
    Mark,
    markInputRule,
    markPasteRule,
    mergeAttributes,
  } from '@tiptap/core'
  
  export interface StrikeOptions {
    HTMLAttributes: Record<string, any>,
  }
  
  declare module '@tiptap/core' {
    interface Commands<ReturnType> {
      underline: {
        /**
         * Set an underline mark
         */
        setUnderline: () => ReturnType,
        /**
         * Toggle an underline mark
         */
        toggleUnderline: () => ReturnType,
        /**
         * Unset an underline mark
         */
        unsetUnderline: () => ReturnType,
      }
    }
  }
  
  
  export const inputRegex = /(?:^|\s)((?:\[%)((?:[^\[%\]]+))(?:\%\]))$/
  export const pasteRegex = /(?:^|\s)((?:\[%)((?:[^\[%\]]+))(?:\%\]))/g
  
  export const Underline = Mark.create<StrikeOptions>({
    name: 'underline',
  
    addOptions() {
      return {
        HTMLAttributes: {},
      }
    },
  
    parseHTML() {
        return [
          {
            tag: 'u',
          },
          {
            style: 'text-decoration',
            consuming: false,
            getAttrs: style => ((style as string).includes('underline') ? {} : false),
          },
        ]
      },
  
    renderHTML({ HTMLAttributes }) {
      return ['u', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
    },
  
    addCommands() {
      return {
        setUnderline: () => ({ commands }) => {
            return commands.setMark(this.name)
          },
          toggleUnderline: () => ({ commands }) => {
            return commands.toggleMark(this.name)
          },
          unsetUnderline: () => ({ commands }) => {
            return commands.unsetMark(this.name)
          },
      }
    },
  
    addKeyboardShortcuts() {
      return {
        'Mod-Shift-x': () => this.editor.commands.toggleStrike(),
      }
    },
  
    addInputRules() {
      return [
        markInputRule({
          find: inputRegex,
          type: this.type,
        }),
      ]
    },
  
    addPasteRules() {
      return [
        markPasteRule({
          find: pasteRegex,
          type: this.type,
        }),
      ]
    },
  })