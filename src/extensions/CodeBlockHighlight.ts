import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { EditorContent, ReactNodeViewRenderer, useEditor } from "@tiptap/react";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import python from "highlight.js/lib/languages/python";
import shell from "highlight.js/lib/languages/shell";
import clang from "highlight.js/lib/languages/c";
import cplusplus from "highlight.js/lib/languages/cpp";
// load all highlight.js languages
import { lowlight } from "lowlight";

import CodeBlockComponent from "./CodeBlockComponent";

lowlight.registerLanguage("html", html);
lowlight.registerLanguage("css", css);
lowlight.registerLanguage("js", js);
lowlight.registerLanguage("javascript", js);
lowlight.registerLanguage("ts", ts);
lowlight.registerLanguage("typescript", ts);
lowlight.registerLanguage("py", python);
lowlight.registerLanguage("python", python);
lowlight.registerLanguage("c", clang);
lowlight.registerLanguage("cpp", cplusplus);
lowlight.registerLanguage("sh", shell);
lowlight.registerLanguage("shell", shell);
lowlight.registerLanguage("bash", shell);

export const CodeBlockHighlight = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockComponent);
  },
}).configure({ lowlight });
