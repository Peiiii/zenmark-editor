import CharacterCount from "@tiptap/extension-character-count";
import Document from "@tiptap/extension-document";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { AnyExtension, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";
import "./styles";

import { ExpandMenuBar } from "@/actions/page";
import MenuItem from "@/components/MenuItem";
import MathBlock from "@/extensions/MathBlock";
import MathInline from "@/extensions/MathInline";
import MyTable from "@/extensions/MyTable";
import { MyTableCell } from "@/extensions/MyTableCell";
import MyTableRow from "@/extensions/MyTableRow";
import { Underline } from "@/extensions/Underline";
import { Markdown } from "@/extensions/tiptap-markdown";
import { initialContent } from "@/initialize";
import { device } from "@/utils/device";
import Focus from "@tiptap/extension-focus";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Link from "@tiptap/extension-link";
import ListKeymap from "@tiptap/extension-list-keymap";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TableHeader from "@tiptap/extension-table-header";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import { AiOutlineEdit } from "react-icons/ai";
import { MessageContainer } from "./common/utils";
import { useLocalStorage } from "./utils/useLocalStorage";
import { createKeyboardEvent } from "./utils/keyboard";
import BubbleMenu from "./components/BubbleMenu";
import MenuBar from "./components/MenuBar";
import type React from "react";
import { CodeBlockHighlight } from "./extensions/CodeBlockHighlight";
import { ColorHighlighter } from "./extensions/ColorHighlighter";
import { Iframe } from "./extensions/Iframe";
import { Invite } from "./extensions/Invite";
import { SmilieReplacer } from "./extensions/SmilieReplacer";
import { Suggestion } from "./extensions/Suggestion";
import { i18n } from "@/services/i18n";
// import { TableTooltip } from "@/extensions/MyTable/TableWidget";

// const ydoc = new Y.Doc();
// const provider = buildWebrtcProvider(ydoc);

export type KeyboardEventHandler = (event: {
  keyCode: number;
  code: string;
  key: string;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  preventDefault: () => void;
  stopPropagation: () => void;
}) => void | boolean;

export interface ZenmarkEditorProps {
  value: string;
  onChange: (content: string) => void;
  /**
   * Called when a key is pressed in the editor.
   * Return `true` to prevent the default behavior.
   * Similar to Monaco Editor's `onKeyDown`.
   */
  onKeyDown?: KeyboardEventHandler;
}

export const ZenmarkEditor = ({
  value,
  onChange,
  onKeyDown,
}: ZenmarkEditorProps) => {
  // const [status, setStatus] = useState("connecting");
  // const [currentUser, setCurrentUser] = useState(getInitialUser);
  const [editable, setEditable] = useState(true);
  const [showToolBarDropdownButton, setShowToolBarDropdownButton] =
    useState(false);
  const isUpdatingRef = useRef(false);

  const editor = useEditor({
    editable,
    extensions: [
      StarterKit.configure({
        document: false,
        codeBlock: false,
        // history: false,
        horizontalRule: false,
        // code: false,
      }),
      Markdown,
      // Code.configure({
      //   HTMLAttributes: {
      //     "data-mark":"code"
      //   },
      // }),
      Document,
      TextAlign.configure({
        types: ["tableCell", "tableHeader", "heading", "paragraph"],
      }),
      HorizontalRule,
      // Document.extend({
      //   content: 'heading block*',
      // }),
      // Paragraph,
      // Text,
      // Code,
      // Dropcursor,
      // Gapcursor,
      Underline,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      ListKeymap,
      Focus.configure({ className: "focus" }),
      Subscript,
      Superscript,
      Highlight,

      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link,
      Typography,

      // TableCell,
      MyTableCell,
      TableHeader,
      // TableRow,
      MyTableRow,
      // Table,
      MyTable,

      CharacterCount,
      ColorHighlighter,
      SmilieReplacer,
      CodeBlockHighlight,
      // CodeBlockLowlight,
      Invite,
      Suggestion,
      Iframe,
      MathInline,
      MathBlock,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return i18n.get({
              key: "editor.HeadingPlaceholder",
              defaultValue: "Type a heading",
            });
          }

          if (["bulletList", "orderedList"].includes(node.type.name)) {
            return i18n.get({
              key: "editor.ListPlaceholder",
              defaultValue: "   Type a list item",
            });
          }
          if (["taskList"].includes(node.type.name)) {
            return i18n.get({
              key: "editor.TaskListPlaceholder",
              defaultValue: "      Type a task",
            });
          }
          return i18n.get({
            key: "editor.StartOfLinePlaceholder",
            defaultValue: "type / for commands?",
          });
        },
      }),

      // Collaboration.configure({
      //   document: ydoc,
      // }),
      // CollaborationCursor.configure({
      //   provider: provider,
      // }),
    ] as AnyExtension[],
    content: value || initialContent,
    onUpdate: ({ editor }) => {
      if (isUpdatingRef.current) return;
      const markdown = editor.storage.markdown?.getMarkdown() || editor.getHTML();
      onChange(markdown);
    },
    editorProps: {
      handleKeyDown: (view, event) => {
        if (onKeyDown) {
          // ProseMirror event is a native KeyboardEvent
          const keyboardEvent = createKeyboardEvent(event as globalThis.KeyboardEvent);
          const result = onKeyDown(keyboardEvent);
          if (result === true) {
            event.preventDefault();
            event.stopPropagation();
            return true;
          }
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    
    const currentMarkdown = editor.storage.markdown?.getMarkdown() || editor.getHTML();
    if (currentMarkdown !== value && value !== undefined) {
      isUpdatingRef.current = true;
      editor.commands.setContent(value || '', false);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  }, [editor, value]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
      // console.log("doc:", editor.state.doc);
    }
  }, [editable, editor]);

  useEffect(() => {
    let timeout;
    if (showToolBarDropdownButton) {
      timeout = setTimeout(() => {
        setShowToolBarDropdownButton(false);
      }, 10000);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [showToolBarDropdownButton]);

  // useEffect(() => {
  //   // Update status changes
  //   provider.on("status", (event) => {
  //     // console.log(event);
  //     setStatus(event.status);
  //   });
  // }, []);

  // Save current user to localStorage and emit to editor
  // useEffect(() => {
  //   if (editor && currentUser) {
  //     localStorage.setItem("currentUser", JSON.stringify(currentUser));
  //     editor.chain().focus().updateUser(currentUser).run();
  //   }
  // }, [editor, currentUser]);

  // const setName = useCallback(() => {
  //   const name = (window.prompt("Name") || "").trim().substring(0, 32);
  //   if (name) {
  //     return setCurrentUser({ ...currentUser, name });
  //   }
  // }, [currentUser]);

  const [collapsed, setCollapsed] = useLocalStorage<boolean>(
    "tiptap-editor:collapsed",
    device.isMobile()
  );

  return (
    <div
      className="editor"
      // Capture keydown at the React capture phase so consumers (onKeyDown)
      // can reliably intercept combos like Cmd/Ctrl+S before ProseMirror/Tiptap
      // keymaps see them. If the consumer returns true, we stop propagation
      // to prevent the editor or browser default from handling it.
      onKeyDownCapture={(e: React.KeyboardEvent) => {
        if (!onKeyDown) return;
        const keyboardEvent = createKeyboardEvent(e.nativeEvent);
        const handled = onKeyDown(keyboardEvent);
        if (handled === true) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      onClick={() => {
        if (editable && collapsed && !showToolBarDropdownButton) {
          setShowToolBarDropdownButton(true);
        }
      }}
    >
      <div className={"editor-header" + (collapsed ? " hidden" : "")}>
        {editor && (
          <div style={{ display: "flex", flexFlow: "row-reverse" }}>
            {!editable && (
              <AiOutlineEdit
                style={{ padding: "5px" }}
                onClick={() => {
                  setEditable(true);
                }}
              />
            )}
          </div>
        )}
        {editor && <MenuBar editor={editor} onCollapse={() => setCollapsed(true)} />}
      </div>
      {editor && collapsed && showToolBarDropdownButton && (
        <div className="sticky-widget">
          <div className="sticky-widget-left" />
          <div className="sticky-widget-right">
            <div className="sticky-widget-inner">
              <MenuItem 
                editor={editor} 
                {...ExpandMenuBar} 
                action={() => {
                  setCollapsed(false);
                  return true;
                }}
              />
            </div>
          </div>
        </div>
      )}
      <div className="editor-middle scroll scroll-8">
        <div className="editor-inner">
          {editor && editable && <BubbleMenu editor={editor} />}
          {/* {editor && <FloatingMenu editor={editor} />} */}
          <div className="editor-content-wrapper  scroll scroll-7">
            <div className="editor-content-extra-left" />
            <EditorContent
              className="editor-content scroll scroll-7"
              editor={editor}
            />
            <div className="editor-content-extra-right" />
          </div>
          {/* {editor && <div className="character-count">
     {editor!.storage.characterCount.characters()} characters
     <br />
     {editor!.storage.characterCount.words()} words
   </div>} */}
          {/* {editor && editable && (
     <div className="editor__footer">
       <div className={`editor__status editor__status--${status}`}>
         {editor!.storage.collaborationCursor.users.length > 1 ||
         status === "connected"
           ? `${editor!.storage.collaborationCursor.users.length} user${
               editor!.storage.collaborationCursor.users.length === 1
                 ? ""
                 : "s"
             } online.`
           : "offline"}
       </div>
       <div className="editor__name">
         <button onClick={setName}>{currentUser.name}</button>
       </div>
     </div>
   )} */}
          {MessageContainer}
        </div>
      </div>
    </div>
  );
};
