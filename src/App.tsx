import CharacterCount from "@tiptap/extension-character-count";
import Document from "@tiptap/extension-document";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
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
import xbook from "xbook";
import { getInitialUser } from "./common/collab-utils";
import { MessageContainer } from "./common/utils";
import BubbleMenu from "./components/BubbleMenu";
import MenuBar from "./components/MenuBar";
import { CodeBlockHighlight } from "./extensions/CodeBlockHighlight";
import { ColorHighlighter } from "./extensions/ColorHighlighter";
import { Iframe } from "./extensions/Iframe";
import { Invite } from "./extensions/Invite";
import { SaveFile } from "./extensions/SaveFile";
import { SmilieReplacer } from "./extensions/SmilieReplacer";
import { Suggestion } from "./extensions/Suggestion";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { EventKeys } from "@/constants/eventKeys";
import { device } from "@/xbook/common/device";
// import { TableTooltip } from "@/extensions/MyTable/TableWidget";

// const ydoc = new Y.Doc();
// const provider = buildWebrtcProvider(ydoc);
export default ({
  readContent,
  writeContent,
  subscribeContent,
}: {
  readContent?: () => Promise<string>;
  writeContent?: (s: string) => Promise<void>;
  subscribeContent?: (cb: (s: string) => void) => () => void;
}) => {
  console.log("[tiptap-editor] version: 2023-12-28");

  // const [status, setStatus] = useState("connecting");
  // const [currentUser, setCurrentUser] = useState(getInitialUser);
  const [editable, setEditable] = useState(true);
  const [showToolBarDropdownButton, setShowToolBarDropdownButton] =
    useState(false);

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
      SaveFile.configure({
        saveContent: writeContent,
        onFileSaved: () => {
          xbook.eventBus.emit(EventKeys.FileSaved);
        },
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
    if (subscribeContent) {
      return subscribeContent((content) => {
        editor?.commands.setContent(content);
      });
    }
  }, [editor, subscribeContent]);

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

  const [collapsed, setCollapsed] = xbook.cacheService
    .space("tiptap-editor", "localStorage")
    .useLocalStorage("collapsed", device.isMobile() ? true : false);

  useEffect(() => {
    xbook.serviceBus.expose("collapseMenuBar", () => setCollapsed(true));
    xbook.serviceBus.expose("expandMenuBar", () => setCollapsed(false));
  }, [setCollapsed]);

  return (
    <div
      className="editor"
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
        {editor && <MenuBar editor={editor} />}
      </div>
      {editor && collapsed && showToolBarDropdownButton && (
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
