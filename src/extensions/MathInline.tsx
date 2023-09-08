/* eslint-disable */
import { Node, mergeAttributes } from "@tiptap/core";

import { inputRules } from "prosemirror-inputrules";

import {
  REGEX_INLINE_MATH_DOLLARS,
  makeInlineMathInputRule,
  mathPlugin,
} from "@benrbray/prosemirror-math";

import "@benrbray/prosemirror-math/style/math.css";
// import "katex/dist/katex.min.css";

export default Node.create({
  name: "math_inline",
  group: "inline math",
  content: "text*", // important!
  inline: true, // important!
  atom: true, // important!
  code: true,

  parseHTML() {
    return [
      {
        tag: "math-inline", // important!
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "math-inline",
      mergeAttributes({ class: "math-node" }, HTMLAttributes),
      0,
    ];
  },

  addProseMirrorPlugins() {
    const inputRulePlugin = inputRules({
      rules: [makeInlineMathInputRule(REGEX_INLINE_MATH_DOLLARS, this.type)],
    });

    return [inputRulePlugin];
  },
});
