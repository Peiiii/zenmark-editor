/* eslint-disable */
import { Node, mergeAttributes } from "@tiptap/core";

import { inputRules } from "prosemirror-inputrules";

import {
  REGEX_BLOCK_MATH_DOLLARS,
  makeBlockMathInputRule,
  mathPlugin,
} from "@benrbray/prosemirror-math";
import "@benrbray/prosemirror-math/style/math.css";
import "katex/dist/katex.min.css";
export default Node.create({
  name: "math_display",
  group: "block math",
  content: "text*", // important!
  atom: true, // important!
  code: true,

  parseHTML() {
    return [
      {
        tag: "math-display", // important!
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "math-display",
      mergeAttributes({ class: "math-node" }, HTMLAttributes),
      0,
    ];
  },

  addProseMirrorPlugins() {
    const inputRulePlugin = inputRules({
      rules: [makeBlockMathInputRule(REGEX_BLOCK_MATH_DOLLARS, this.type)],
    });

    return [
        // mathPlugin, 
        inputRulePlugin];
  },
});
