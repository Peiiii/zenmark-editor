import { Extension } from "@tiptap/core";
import TiptapSuggestion from "@tiptap/suggestion";
import getSuggestionItems from "./searchItems";
import renderItems from "./renderItems";

export const Suggestion = Extension.create({
  name: "suggestion",
  addOptions:()=> ({
    suggestion: {
      char: "/",
      startOfLine: false,
      items: getSuggestionItems,
      render: renderItems,
      command: ({ editor, range, props }) => {
        props.command({ editor, range, props });
      }
    }
  }),
  addProseMirrorPlugins() {
    return [
      TiptapSuggestion({
        editor: this.editor,
        ...this.options.suggestion
      })
    ];
  }
});

