import { Editor, Range } from "@tiptap/react";
export type Action = {
  id?: string;
  icon: React.ComponentType;
  title?: string;
  name: string;
  action?: (editor: Editor) => any;
  command?: (state: { editor: Editor; range: Range }) => void;
  isActive?: (editor: Editor) => boolean;
  discription?: string;
};

export type SuggestionItem = Omit<Action, "id"> & {
  id: string;
};
