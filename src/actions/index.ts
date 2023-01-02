import { Editor } from "@tiptap/react";
import { fs } from "../common/fs";
import {history} from "../common/history";
interface Action {
    icon: string;
    title?: string;
    action?: (editor: Editor) => any;
    isActive?: (editor: Editor) => boolean;
}

export const Bold: Action = {
    icon: 'bold',
    title: 'Bold',
    action: (editor) => editor.chain().focus().toggleBold().run(),
    isActive: (editor) => editor.isActive('bold'),
};
export const Italic = {
    icon: 'italic',
    title: 'Italic',
    action: (editor) => editor.chain().focus().toggleItalic().run(),
    isActive: (editor) => editor.isActive('italic'),
};

export const Strikethrough = {
    icon: 'strikethrough',
    title: 'Strike',
    action: (editor) => editor.chain().focus().toggleStrike().run(),
    isActive: (editor) => editor.isActive('strike'),
};
export const CodeView = {
    icon: 'code-view',
    title: 'Code',
    action: (editor) => editor.chain().focus().toggleCode().run(),
    isActive: (editor) => editor.isActive('code'),
}
export const MarkPenLine = {
    icon: 'mark-pen-line',
    title: 'Highlight',
    action: (editor) => editor.chain().focus().toggleHighlight().run(),
    isActive: (editor) => editor.isActive('highlight'),
};
export const Divider = {
    type: 'divider',
};
export const H1 = {
    icon: 'h-1',
    title: 'Heading 1',
    action: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 1 }),
};
export const H2 = {
    icon: 'h-2',
    title: 'Heading 2',
    action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 2 }),
};
export const Paragraph = {
    icon: 'paragraph',
    title: 'Paragraph',
    action: (editor) => editor.chain().focus().setParagraph().run(),
    isActive: (editor) => editor.isActive('paragraph'),
};
export const ListUnordered = {
    icon: 'list-unordered',
    title: 'Bullet List',
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
    isActive: (editor) => editor.isActive('bulletList'),
};
export const ListOrdered = {
    icon: 'list-ordered',
    title: 'Ordered List',
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive('orderedList'),
};
export const ListCheck2 = {
    icon: 'list-check-2',
    title: 'Task List',
    action: (editor) => editor.chain().focus().toggleTaskList().run(),
    isActive: (editor) => editor.isActive('taskList'),
};
export const CodeBoxLine = {
    icon: 'code-box-line',
    title: 'Code Block',
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    isActive: (editor) => editor.isActive('codeBlock'),
};

export const DoubleQuotes1 = {
    icon: 'double-quotes-l',
    title: 'Blockquote',
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
    isActive: (editor) => editor.isActive('blockquote'),
};
export const Separator = {
    icon: 'separator',
    title: 'Horizontal Rule',
    action: (editor) => editor.chain().focus().setHorizontalRule().run(),
};

export const TextWrap = {
    icon: 'text-wrap',
    title: 'Hard Break',
    action: (editor) => editor.chain().focus().setHardBreak().run(),
};
export const FormatClear = {
    icon: 'format-clear',
    title: 'Clear Format',
    action: (editor) => editor.chain().focus().clearNodes().unsetAllMarks()
        .run(),
};

export const GoBackLine = {
    icon: 'arrow-go-back-line',
    title: 'Undo',
    action: (editor) => editor.chain().focus().undo().run(),
};
export const GoForwardLine = {
    icon: 'arrow-go-forward-line',
    title: 'Redo',
    action: (editor) => editor.chain().focus().redo().run(),
};

export const AlignLeft: Action = {
    icon: 'align-left',
    title: 'Align Left',
    action: (editor) => editor.chain().focus().setTextAlign('left').run(),
    isActive: (editor) => editor.isActive({ textAlign: 'left' })
}
export const AlignRight: Action = {
    icon: 'align-right',
    title: 'Align Right',
    action: (editor) => editor.chain().focus().setTextAlign('right').run(),
    isActive: (editor) => editor.isActive({ textAlign: 'right' })
}
export const AlignCenter: Action = {
    icon: 'align-center',
    title: 'Align Center',
    action: (editor) => editor.chain().focus().setTextAlign('center').run(),
    isActive: (editor) => editor.isActive({ textAlign: 'center' })
}
export const AlignJustify: Action = {
    icon: 'align-justify',
    title: 'Align Justify',
    action: (editor) => editor.chain().focus().setTextAlign('justify').run(),
    isActive: (editor) => editor.isActive({ textAlign: 'justify' })
};
export const AddImage: Action = {
    icon: "image-line",
    title: "Add Image",
    action: (editor) => {
        const url = window.prompt('URL')

        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    },
    isActive: (editor) => editor.isActive("image")
};

export const SaveFile:Action={
    icon:"save-line",
    title: "Save File",
    action: (editor) => {
        (editor.commands as any).saveFile();
    },
    isActive: (editor) => false,
}

export const Invite:Action={
    icon:"chat-new-line",
    title: "Invite Collaborator",
    action: (editor) => (editor.commands as any).copyCollabUrl()
}
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
}
