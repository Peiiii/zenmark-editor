import "./styles";
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, {
  useCallback, useEffect,
  useState,
} from 'react'
import * as Y from 'yjs'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text';
import Image from "@tiptap/extension-image";
import Typography from "@tiptap/extension-typography";
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import Highlight from '@tiptap/extension-highlight'

import Code from "@tiptap/extension-code";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Dropcursor from "@tiptap/extension-dropcursor";
import { ColorHighlighter } from "./extensions/ColorHighlighter";
import { SmilieReplacer } from "./extensions/SmilieReplacer";
import { CodeBlockHighlight } from "./extensions/CodeBlockHighlight";
import { SaveFile } from "./extensions/SaveFile";
import { Invite } from "./extensions/Invite";
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import MenuBar from './components/MenuBar';
import BubbleMenu from "./components/BubbleMenu";
import FloatingMenu from "./components/FloatingMenu";
import { buildWebrtcProvider, getInitialUser } from "./common/collab-utils";
import { MessageContainer } from "./common/utils";
import { Suggestion } from "./extensions/Suggestion";
import { Iframe } from "./extensions/Iframe";
import { RemixIcon } from "./components/RemixIcon";
import {AiOutlineEdit, AiOutlineRead} from "react-icons/ai"
import MathInline from "@/extensions/MathInline";
import MathBlock from "@/extensions/MathBlock";
import Gapcursor from "@tiptap/extension-gapcursor";
import { Underline } from "@/extensions/Underline";




const ydoc = new Y.Doc()
const provider=buildWebrtcProvider(ydoc);


export default () => {
  const [status, setStatus] = useState('connecting')
  const [currentUser, setCurrentUser] = useState(getInitialUser)  
  const [editable,setEditable] = useState(true);
  const editor = useEditor({
    editable,
    extensions: [
      StarterKit.configure({
        document: false,
      }),
      Document,
      // Document.extend({
      //   content: 'heading block*',
      // }),
      Underline,
      TaskList,
      TaskItem,
      Highlight,
      Paragraph,
      Text,
      Code,
      Image.configure({
        inline: true,
        allowBase64: true
      }),
      Link,
      Typography,
      Dropcursor,
      Gapcursor,
      CharacterCount,
      ColorHighlighter,
      SmilieReplacer,
      CodeBlockHighlight,
      SaveFile,
      Invite,
      Suggestion,
      Iframe,
      MathInline,
      MathBlock,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return "Title"
          }
          return 'type / for commands?';
        },
      }),
      
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider: provider,
      }),
    ],
    content: ``
  })

  useEffect(()=>{
    if(editor){
      editor.setEditable(editable)
    }
  },[editable,editor])
  

  useEffect(() => {
    // Update status changes
    provider.on('status', event => {
      console.log(event)
      setStatus(event.status)
    })
  }, [])



  // Save current user to localStorage and emit to editor
  useEffect(() => {
    if (editor && currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
      editor.chain().focus().updateUser(currentUser).run()
    }
  }, [editor, currentUser])

  const setName = useCallback(() => {
    const name = (window.prompt('Name') || '').trim().substring(0, 32)
    if (name) {
      return setCurrentUser({ ...currentUser, name })
    }
  }, [currentUser])

  return (
    <div className="editor">
      {editor && !editable && <div style={{"display":"flex","flexFlow":"row-reverse"}}>
       { !editable && <AiOutlineEdit style={{"padding":"5px"}} onClick={()=>{
          setEditable(true);
        }}/>}
        </div>}
      {/* {editor && editable && <MenuBar editor={editor} />} */}
      {editor && editable && <BubbleMenu editor={editor} />}
      {/* {editor && <FloatingMenu editor={editor} />} */}

      <EditorContent className="editor-content scroll scroll-7" editor={editor} />
      {/* {editor && <div className="character-count">
        {editor!.storage.characterCount.characters()} characters
        <br />
        {editor!.storage.characterCount.words()} words
      </div>} */}
      {
        editor && editable && <div className="editor__footer">
        <div className={`editor__status editor__status--${status}`}>
          {(editor!.storage.collaborationCursor.users.length>1||(status === 'connected'))
            ? `${editor!.storage.collaborationCursor.users.length} user${editor!.storage.collaborationCursor.users.length === 1 ? '' : 's'} online.`
            : 'offline'}
        </div>
        <div className="editor__name">
          <button onClick={setName}>{currentUser.name}</button>
        </div>
      </div>
      }
      {MessageContainer}
    </div>
  )
}
