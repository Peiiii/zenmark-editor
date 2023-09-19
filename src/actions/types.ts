import { Editor, Range } from "@tiptap/react";
export interface Action {
  icon: React.ComponentType;
  title?: string;
  action?: (editor: Editor) => any;
  command?: (state: { editor: Editor; range: Range }) => void;
  isActive?: (editor: Editor) => boolean;
  discription?: string;
}
