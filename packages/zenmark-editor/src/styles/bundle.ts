// Build the concatenated CSS string for Zenmark Editor.
// Each import uses ?inline so Vite inlines the compiled CSS content as a string.

import appCss from "../css/App.scss?inline";
import editorCss from "../css/editor.scss?inline";
import forceTitleCss from "../css/force-title.scss?inline";
import taskListCss from "../css/task-list.scss?inline";
import extensionCodeCss from "../css/extension-code.scss?inline";
import characterCountCss from "../css/CharacterCount.scss?inline";
// import suggestionCss from "../css/Suggestion.scss?inline";
import menusCss from "../css/menus.scss?inline";
import iframeCss from "../css/Iframe.scss?inline";
import mathDisplayCss from "../css/MathDisplay.scss?inline";
import tableCss from "../css/Table.scss?inline";
import focusCss from "../css/Focus.scss?inline";
import scrollCss from "../css/scroll.scss?inline";
import themeBasicCss from "../css/themes/basic.scss?inline";
import themeProseMirrorListsCss from "../css/themes/prose-mirror-lists.scss?inline";
// import themeGithubMarkdownCss from "../css/themes/github-markdown.scss?inline";
// import themeGithubMarkdownTailwindCss from "../css/themes/github-markdown-tailwindcss.css?inline";
// import themeThemeableLightCss from "../css/themes/themeable-light.scss?inline";
import globalCss from "../css/global.scss?inline";

export const getZenmarkCss = (): string =>
  appCss +
  editorCss +
  forceTitleCss +
  taskListCss +
  extensionCodeCss +
  characterCountCss +
  menusCss +
  iframeCss +
  mathDisplayCss +
  tableCss +
  focusCss +
  scrollCss +
  themeBasicCss +
  themeProseMirrorListsCss +
  globalCss;

