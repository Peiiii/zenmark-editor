import "./styles";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useCallback, useEffect, useState } from "react";
import * as Y from "yjs";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Image from "@tiptap/extension-image";
import Typography from "@tiptap/extension-typography";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Highlight from "@tiptap/extension-highlight";

import Code from "@tiptap/extension-code";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Dropcursor from "@tiptap/extension-dropcursor";
import { ColorHighlighter } from "./extensions/ColorHighlighter";
import { SmilieReplacer } from "./extensions/SmilieReplacer";
import { CodeBlockHighlight } from "./extensions/CodeBlockHighlight";
import { SaveFile } from "./extensions/SaveFile";
import { Invite } from "./extensions/Invite";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Table from "@tiptap/extension-table";
import MenuBar from "./components/MenuBar";
import BubbleMenu from "./components/BubbleMenu";
import FloatingMenu from "./components/FloatingMenu";
import { buildWebrtcProvider, getInitialUser } from "./common/collab-utils";
import { MessageContainer } from "./common/utils";
import { Suggestion } from "./extensions/Suggestion";
import { Iframe } from "./extensions/Iframe";
import { AiOutlineEdit, AiOutlineRead } from "react-icons/ai";
import MathInline from "@/extensions/MathInline";
import MathBlock from "@/extensions/MathBlock";
import Gapcursor from "@tiptap/extension-gapcursor";
import { Underline } from "@/extensions/Underline";
import MyTable from "@/extensions/MyTable";
import MyTableRow from "@/extensions/MyTableRow";
import { MyTableCell } from "@/extensions/MyTableCell";
import { Markdown } from "@/extensions/tiptap-markdown";
import { initialContent } from "@/initialize";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import ListKeymap from "@tiptap/extension-list-keymap";
import Focus from "@tiptap/extension-focus";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import xbook from "xbook";
import MenuItem from "@/components/MenuItem";
import { ExpandMenuBar } from "@/actions/page";
// import { TableTooltip } from "@/extensions/MyTable/TableWidget";

const ydoc = new Y.Doc();
const provider = buildWebrtcProvider(ydoc);

export default ({
  readContent,
  writeContent,
}: {
  readContent?: () => Promise<string>;
  writeContent?: (s: string) => Promise<void>;
}) => {
  const [status, setStatus] = useState("connecting");
  const [currentUser, setCurrentUser] = useState(getInitialUser);
  const [editable, setEditable] = useState(true);

  const editor = useEditor({
    editable,
    extensions: [
      StarterKit.configure({
        document: false,
        codeBlock: false,
        // history: false,
        horizontalRule: false,
      }),
      Markdown,
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
      SaveFile.configure({
        saveContent: writeContent,
      }),
      Invite,
      Suggestion,
      Iframe,
      MathInline,
      MathBlock,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return "Title";
          }
          return "type / for commands?";
        },
      }),

      // Collaboration.configure({
      //   document: ydoc,
      // }),
      // CollaborationCursor.configure({
      //   provider: provider,
      // }),
    ],
    content: initialContent,
  });
  useEffect(() => {
    // return window.addEventListener(
    //   "message",
    //   (event) => {
    //     console.log(event);
    //     const { content } = JSON.parse(event.data);
    //     editor?.commands.setContent(content);
    //   },
    //   false
    // );
    if (readContent && editor) {
      readContent().then((content) => editor.commands.setContent(content));
    }
  }, [editor, readContent]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
      // console.log("doc:", editor.state.doc);
    }
  }, [editable, editor]);

  useEffect(() => {
    // Update status changes
    provider.on("status", (event) => {
      // console.log(event);
      setStatus(event.status);
    });
  }, []);

  // Save current user to localStorage and emit to editor
  // useEffect(() => {
  //   if (editor && currentUser) {
  //     localStorage.setItem("currentUser", JSON.stringify(currentUser));
  //     editor.chain().focus().updateUser(currentUser).run();
  //   }
  // }, [editor, currentUser]);

  const setName = useCallback(() => {
    const name = (window.prompt("Name") || "").trim().substring(0, 32);
    if (name) {
      return setCurrentUser({ ...currentUser, name });
    }
  }, [currentUser]);

  const [collapsed, setCollapsed] = xbook.cacheService
    .space("tiptap-editor", "localStorage")
    .useLocalStorage("collapsed", false);

  useEffect(() => {
    xbook.serviceBus.expose("collapseMenuBar", () => setCollapsed(true));
    xbook.serviceBus.expose("expandMenuBar", () => setCollapsed(false));
  }, [setCollapsed]);

  return (
    <div className="editor">
      <div className={"editor-header" + (collapsed ? " hidden" : "")}>
        {editor && !editable && (
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
        {editor && editable && <MenuBar editor={editor} />}
      </div>
      {editor && collapsed && (
        <div className="sticky-widget">
          <div className="sticky-widget-left" />
          <div className="sticky-widget-right">
            <div className="sticky-widget-inner">
              <MenuItem editor={editor} {...ExpandMenuBar} />
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
