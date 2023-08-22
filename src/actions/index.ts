import { Editor, Range } from "@tiptap/react";
import { fs } from "../common/fs";
import { history } from "../common/history";
interface Action {
  icon: string;
  title?: string;
  action?: (editor: Editor) => any;
  command?: (state: { editor: Editor; range: Range }) => void;
  isActive?: (editor: Editor) => boolean;
  discription?: string;
}

export const Bold: Action = {
  icon: "bold",
  title: "Bold",
  action: (editor) => editor.chain().focus().toggleBold().run(),
  isActive: (editor) => editor.isActive("bold"),
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setMark("bold").run();
  },
};
export const Italic = {
  icon: "italic",
  title: "Italic",
  action: (editor) => editor.chain().focus().toggleItalic().run(),
  isActive: (editor) => editor.isActive("italic"),
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setMark("italic").run();
  },
};

export const Strikethrough = {
  icon: "strikethrough",
  title: "Strike",
  action: (editor) => editor.chain().focus().toggleStrike().run(),
  isActive: (editor) => editor.isActive("strike"),
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setMark("strike").run();
  },
};
export const CodeView = {
  icon: "code-view",
  title: "Code",
  action: (editor) => editor.chain().focus().toggleCode().run(),
  isActive: (editor) => editor.isActive("code"),
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setMark("code").run();
  },
};
export const MarkPenLine = {
  icon: "mark-pen-line",
  title: "Highlight",
  action: (editor) => editor.chain().focus().toggleHighlight().run(),
  isActive: (editor) => editor.isActive("highlight"),
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setMark("highlight").run();
  },
};
export const Divider = {
  type: "divider",
};
export const H1 = {
  icon: "h-1",
  title: "Heading 1",
  action: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  isActive: (editor) => editor.isActive("heading", { level: 1 }),
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode("heading", { level: 1 })
      .run();
  },
};
export const H2 = {
  icon: "h-2",
  title: "Heading 2",
  action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  isActive: (editor) => editor.isActive("heading", { level: 2 }),
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode("heading", { level: 2 })
      .run();
  },
};
export const Paragraph = {
  icon: "paragraph",
  title: "Paragraph",
  action: (editor) => editor.chain().focus().setParagraph().run(),
  isActive: (editor) => editor.isActive("paragraph"),
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode("paragraph", { level: 2 })
      .run();
  },
};
export const ListUnordered = {
  icon: "list-unordered",
  title: "Bullet List",
  action: (editor) => editor.chain().focus().toggleBulletList().run(),
  isActive: (editor) => editor.isActive("bulletList"),
};
export const ListOrdered = {
  icon: "list-ordered",
  title: "Ordered List",
  action: (editor) => editor.chain().focus().toggleOrderedList().run(),
  isActive: (editor) => editor.isActive("orderedList"),
};
export const ListCheck2 = {
  icon: "list-check-2",
  title: "Task List",
  action: (editor) => editor.chain().focus().toggleTaskList().run(),
  isActive: (editor) => editor.isActive("taskList"),
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setNode("taskList").run();
  },
};
export const CodeBoxLine = {
  icon: "code-box-line",
  title: "Code Block",
  action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  isActive: (editor) => editor.isActive("codeBlock"),
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setNode("codeBlock").run();
  },
};

export const DoubleQuotes1 = {
  icon: "double-quotes-l",
  title: "Blockquote",
  action: (editor) => editor.chain().focus().toggleBlockquote().run(),
  isActive: (editor) => editor.isActive("blockquote"),
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).toggleBlockquote().run();
  },
};
export const Separator = {
  icon: "separator",
  title: "Horizontal Rule",
  description: "separator",
  action: (editor: Editor) => editor.chain().focus().setHorizontalRule().run(),
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setHorizontalRule().run();
  },
};

export const TextWrap = {
  icon: "text-wrap",
  title: "Hard Break",
  action: (editor) => editor.chain().focus().setHardBreak().run(),
};
export const FormatClear = {
  icon: "format-clear",
  title: "Clear Format",
  action: (editor) => editor.chain().focus().clearNodes().unsetAllMarks().run(),
};

export const GoBackLine = {
  icon: "arrow-go-back-line",
  title: "Undo",
  action: (editor) => editor.chain().focus().undo().run(),
};
export const GoForwardLine = {
  icon: "arrow-go-forward-line",
  title: "Redo",
  action: (editor) => editor.chain().focus().redo().run(),
};

export const AlignLeft: Action = {
  icon: "align-left",
  title: "Align Left",
  action: (editor) => editor.chain().focus().setTextAlign("left").run(),
  isActive: (editor) => editor.isActive({ textAlign: "left" }),
};
export const AlignRight: Action = {
  icon: "align-right",
  title: "Align Right",
  action: (editor) => editor.chain().focus().setTextAlign("right").run(),
  isActive: (editor) => editor.isActive({ textAlign: "right" }),
};
export const AlignCenter: Action = {
  icon: "align-center",
  title: "Align Center",
  action: (editor) => editor.chain().focus().setTextAlign("center").run(),
  isActive: (editor) => editor.isActive({ textAlign: "center" }),
};
export const AlignJustify: Action = {
  icon: "align-justify",
  title: "Align Justify",
  action: (editor) => editor.chain().focus().setTextAlign("justify").run(),
  isActive: (editor) => editor.isActive({ textAlign: "justify" }),
};
export const AddImage: Action = {
  icon: "image-line",
  title: "Add Image",
  action: (editor) => {
    const url = window.prompt("URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  },
  isActive: (editor) => editor.isActive("image"),
  command: ({ editor, range }) => {
    const url = window.prompt("URL");
    if (url) {
      editor.chain().focus().deleteRange(range).setImage({ src: url }).run();
    }
  },
};

export const SaveFile: Action = {
  icon: "save-line",
  title: "Save File",
  action: (editor) => {
    (editor.commands as any).saveFile();
  },
  isActive: (editor) => false,
};

export const Invite: Action = {
  icon: "chat-new-line",
  title: "Invite Collaborator",
  action: (editor) => (editor.commands as any).copyCollabUrl(),
};

export const Iframe: Action = {
  icon: "window-line",
  title: "Iframe",
  action: (editor) => {
    const url = window.prompt("URL");
    if (url) {
      editor.chain().focus().setIframe({ src: url }).run();
    }
  },
};

export const AddTableColumnBefore: Action = {
  icon: "arrow-left-line",
  title: "Add Table Column Left",
  action: (editor: Editor) => {
    editor.commands.addColumnBefore();
  },
};
export const AddTableColumnAfter: Action = {
  icon: "arrow-right-line",
  title: "Add Table Column Right",
  action: (editor: Editor) => {
    editor.commands.addColumnAfter();
  },
};
export const AddTableRowBefore: Action = {
  icon: "arrow-up-line",
  title: "Add Table Row Up",
  action: (editor: Editor) => {
    editor.commands.addRowBefore();
  },
};
export const AddTableRowAfter: Action = {
  icon: "arrow-down-line",
  title: "Add Table Row Down",
  action: (editor: Editor) => {
    editor.commands.addRowAfter();
  },
};
export const Actions = {
  Bold,
  Italic,
  Strikethrough,
  CodeView,
  MarkPenLine,
  Divider,
  H1,
  H2,
  Paragraph,
  ListOrdered,
  ListUnordered,
  ListCheck2,
  CodeBoxLine,
  DoubleQuotes1,
  Separator,
  TextWrap,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  AddImage,
  FormatClear,
  GoBackLine,
  GoForwardLine,
  SaveFile,
  Invite,
  Iframe,
  AddTableColumnBefore,
  AddTableColumnAfter,
  AddTableRowBefore,
  AddTableRowAfter,
};
