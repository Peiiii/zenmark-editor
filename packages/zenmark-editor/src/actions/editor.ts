import { Action } from "@/actions/types";
import { i18n } from "@/services/i18n";
import { Editor } from "@tiptap/react";
import {
  AiOutlineAlignCenter,
  AiOutlineAlignLeft,
  AiOutlineAlignRight,
  AiOutlineArrowDown,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineArrowUp,
  AiOutlineBold,
  AiOutlineCheckSquare,
  AiOutlineCode,
  AiOutlineFileImage,
  AiOutlineHighlight,
  AiOutlineItalic,
  AiOutlineLink,
  AiOutlineOrderedList,
  AiOutlineSave,
  AiOutlineStrikethrough,
  AiOutlineUnorderedList,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { BiAlignJustify, BiCodeBlock, BiParagraph } from "react-icons/bi";
import { BsBlockquoteLeft, BsTextWrap } from "react-icons/bs";
import { FaRemoveFormat } from "react-icons/fa";
import { LuHeading1, LuHeading2 } from "react-icons/lu";
import { PiFrameCorners } from "react-icons/pi";
import { VscHorizontalRule } from "react-icons/vsc";

export const Bold: Action = {
  name: "bold",
  icon: AiOutlineBold,
  title: i18n.get({
    key: "action.Bold",
    defaultValue: "Bold",
  }),
  action: (editor) => editor.chain().focus().toggleBold().run(),
  isActive: (editor) => editor.isActive("bold"),
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setMark("bold").run();
  },
};
export const Italic: Action = {
  name: "italic",
  icon: AiOutlineItalic,
  title: i18n.get({
    key: "action.Italic",
    defaultValue: "Italic",
  }),
  action: (editor) => editor.chain().focus().toggleItalic().run(),
  isActive: (editor) => editor.isActive("italic"),
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setMark("italic").run();
  },
};

export const Strikethrough = {
  name: "strikethrough",
  icon: AiOutlineStrikethrough,
  title: i18n.get({
    key: "action.Strikethrough",
    defaultValue: "Strikethrough",
  }),
  action: (editor) => editor.chain().focus().toggleStrike().run(),
  isActive: (editor) => editor.isActive("strike"),
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setMark("strike").run();
  },
};
export const CodeView = {
  name: "code",
  icon: AiOutlineCode,
  title: i18n.get({
    key: "action.CodeView",
    defaultValue: "Code",
  }),
  action: (editor) => editor.chain().focus().toggleCode().run(),
  isActive: (editor) => editor.isActive("code"),
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setMark("code").run();
  },
};
export const Highlight = {
  name: "highlight",
  icon: AiOutlineHighlight,
  title: i18n.get({
    key: "action.MarkPenLine",
    defaultValue: "Highlight",
  }),
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
  name: "heading1",
  icon: LuHeading1,
  title: i18n.get({
    key: "action.H1",
    defaultValue: "Heading 1",
  }),
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
  name: "heading2",
  icon: LuHeading2,
  title: i18n.get({
    key: "action.H2",
    defaultValue: "Heading 2",
  }),
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
  name: "paragraph",
  icon: BiParagraph,
  title: i18n.get({
    key: "action.Paragraph",
    defaultValue: "Paragraph",
  }),
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
export const BulletList = {
  id: "bulletList",
  name: "bulletList",
  icon: AiOutlineUnorderedList,
  title: i18n.get({
    key: "action.BulletList",
    defaultValue: "Bullet List",
  }),
  action: (editor) => editor.chain().focus().toggleBulletList().run(),
  isActive: (editor) => editor.isActive("bulletList"),
  command: ({ editor, range }) =>
    editor.chain().focus().deleteRange(range).toggleBulletList().run(),
};
export const OrderedList = {
  id: "orderedList",
  name: "orderedList",
  icon: AiOutlineOrderedList,
  title: i18n.get({
    key: "action.OrderedList",
    defaultValue: "Ordered List",
  }),
  action: (editor) => editor.chain().focus().toggleOrderedList().run(),
  isActive: (editor) => editor.isActive("orderedList"),
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).toggleOrderedList().run();
  },
};
export const TaskList = {
  name: "taskList",
  icon: AiOutlineCheckSquare,
  title: i18n.get({
    key: "action.TaskList",
    defaultValue: "Task List",
  }),
  action: (editor) => editor.chain().focus().toggleTaskList().run(),
  isActive: (editor) => editor.isActive("taskList"),
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).toggleTaskList().run();
  },
};
export const CodeBlock = {
  name: "codeBlock",
  icon: BiCodeBlock,
  title: i18n.get({
    key: "action.CodeBlock",
    defaultValue: "Code Block",
  }),
  action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  isActive: (editor) => editor.isActive("codeBlock"),
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setNode("codeBlock").run();
  },
};
export const DoubleQuotes1 = {
  name: "blockquote",
  icon: BsBlockquoteLeft,
  title: i18n.get({
    key: "action.Blockquote",
    defaultValue: "Blockquote",
  }),
  action: (editor) => editor.chain().focus().toggleBlockquote().run(),
  isActive: (editor) => editor.isActive("blockquote"),
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).toggleBlockquote().run();
  },
};
export const Separator = {
  type: "separator",
  icon: VscHorizontalRule,
  title: i18n.get({
    key: "action.HorizontalRule",
    defaultValue: "Horizontal Rule",
  }),
  description: "separator",
  action: (editor: Editor) => editor.chain().focus().setHorizontalRule().run(),
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setHorizontalRule().run();
  },
};
export const TextWrap = {
  name: "hardBreak",
  icon: BsTextWrap,
  title: i18n.get({
    key: "action.HardBreak",
    defaultValue: "Hard Break",
  }),
  action: (editor) => editor.chain().focus().setHardBreak().run(),
};
export const FormatClear = {
  name: "clearFormat",
  icon: FaRemoveFormat,
  title: i18n.get({
    key: "action.ClearFormat",
    defaultValue: "Clear Format",
  }),
  action: (editor) => editor.chain().focus().clearNodes().unsetAllMarks().run(),
};
export const GoBackLine = {
  icon: AiOutlineArrowLeft,
  title: i18n.get({
    key: "action.Undo",
    defaultValue: "Undo",
  }),
  action: (editor) => editor.chain().focus().undo().run(),
};
export const GoForwardLine = {
  icon: AiOutlineArrowRight,
  title: i18n.get({
    key: "action.Redo",
    defaultValue: "Redo",
  }),
  action: (editor) => editor.chain().focus().redo().run(),
};
export const AlignLeft: Action = {
  name: "alignLeft",
  icon: AiOutlineAlignLeft,
  title: i18n.get({
    key: "action.AlignLeft",
    defaultValue: "Align Left",
  }),
  action: (editor) => editor.chain().focus().setTextAlign("left").run(),
  isActive: (editor) => editor.isActive({ textAlign: "left" }),
};
export const AlignRight: Action = {
  name: "alignRight",
  icon: AiOutlineAlignRight,
  title: i18n.get({
    key: "action.AlignRight",
    defaultValue: "Align Right",
  }),
  action: (editor) => editor.chain().focus().setTextAlign("right").run(),
  isActive: (editor) => editor.isActive({ textAlign: "right" }),
};
export const AlignCenter: Action = {
  name: "alignCenter",
  icon: AiOutlineAlignCenter,
  title: i18n.get({
    key: "action.AlignCenter",
    defaultValue: "Align Center",
  }),
  action: (editor: Editor) => {
    console.log("editor:", editor);

    editor.chain().focus().setTextAlign("center").run();
  },
  isActive: (editor) => editor.isActive({ textAlign: "center" }),
};
export const AlignJustify: Action = {
  name: "alignJustify",
  icon: BiAlignJustify,
  title: i18n.get({
    key: "action.AlignJustify",
    defaultValue: "Align Justify",
  }),
  action: (editor) => editor.chain().focus().setTextAlign("justify").run(),
  isActive: (editor) => editor.isActive({ textAlign: "justify" }),
};
export const AddImage: Action = {
  name: "image",
  icon: AiOutlineFileImage,
  title: i18n.get({
    key: "action.AddImage",
    defaultValue: "Add Image",
  }),
  action: (editor) => {
    const url = window.prompt(
      i18n.get({ key: "action.ImageURL", defaultValue: "URL" })
    );
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  },
  isActive: (editor) => editor.isActive("image"),
  command: ({ editor, range }) => {
    const url = window.prompt(
      i18n.get({ key: "action.ImageURL", defaultValue: "URL" })
    );
    if (url) {
      editor.chain().focus().deleteRange(range).setImage({ src: url }).run();
    }
  },
};
export const SaveFile: Action = {
  name: "save",
  icon: AiOutlineSave,
  title: i18n.get({
    key: "action.SaveFile",
    defaultValue: "Save File",
  }),
  action: (editor) => {
    (editor.commands as any).saveFile();
  },
  isActive: (editor) => false,
};
export const Invite: Action = {
  name: "invite",
  icon: AiOutlineUserAdd,
  title: i18n.get({
    key: "action.InviteCollaborator",
    defaultValue: "Invite Collaborator",
  }),
  action: (editor) => (editor.commands as any).copyCollabUrl(),
};
export const Iframe: Action = {
  name: "iframe",
  icon: PiFrameCorners,
  title: i18n.get({
    key: "action.Iframe",
    defaultValue: "Iframe",
  }),
  action: (editor) => {
    // const url = window.prompt(
    //   i18n.get({ key: "action.IframeURL", defaultValue: "URL" })
    // );
    // if (url) {
    //   editor.chain().focus().setIframe({ src: url }).run();
    // }
  },
};

export const AddTableColumnBefore: Action = {
  name: "addColumnBefore",
  icon: AiOutlineArrowLeft,
  title: i18n.get({
    key: "action.AddTableColumnLeft",
    defaultValue: "Add Table Column Left",
  }),
  action: (editor: Editor) => {
    editor.commands.addColumnBefore();
  },
};
export const AddTableColumnAfter: Action = {
  name: "addColumnAfter",
  icon: AiOutlineArrowRight,
  title: i18n.get({
    key: "action.AddTableColumnRight",
    defaultValue: "Add Table Column Right",
  }),
  action: (editor: Editor) => {
    editor.commands.addColumnAfter();
  },
};
export const AddTableRowBefore: Action = {
  name: "addRowBefore",
  icon: AiOutlineArrowUp,
  title: i18n.get({
    key: "action.AddTableRowUp",
    defaultValue: "Add Table Row Up",
  }),
  action: (editor: Editor) => {
    editor.commands.addRowBefore();
  },
};
export const AddTableRowAfter: Action = {
  name: "addRowAfter",
  icon: AiOutlineArrowDown,
  title: i18n.get({
    key: "action.AddTableRowDown",
    defaultValue: "Add Table Row Down",
  }),
  action: (editor: Editor) => {
    editor.commands.addRowAfter();
  },
};

export const EditLink: Action = {
  name: "editLink",
  icon: AiOutlineLink,
  title: i18n.get({
    key: "action.EditLink",
    defaultValue: "Edit Link",
  }),
  action: (editor: Editor) => {
    const previousUrl = editor.getAttributes("link").href;
    const url = (
      window.prompt(
        i18n.get({ key: "action.LinkURL", defaultValue: "URL" }),
        previousUrl || ""
      ) || ""
    ).trim();
    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  },
};

export const Actions = {
  Bold,
  Italic,
  Strikethrough,
  CodeView,
  Highlight,
  Divider,
  H1,
  H2,
  Paragraph,
  OrderedList,
  BulletList,
  TaskList,
  CodeBlock,
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
  EditLink,
};
