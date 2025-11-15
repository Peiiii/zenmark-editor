// NOTE:
// Instead of relying on vite-plugin-css-injected-by-js (which is unreliable across
// multiple library outputs), we inline our styles at runtime for ESM/CJS/UMD.
// This module exposes a single, reusable injector function.
import { ZENMARK_STYLE_ID } from "./styles/constants";
import { getZenmarkCss } from "./styles/bundle";

export function ensureZenmarkStylesInjected() {
  if (typeof document === "undefined") return;
  // Avoid duplicate injection
  if (document.getElementById(ZENMARK_STYLE_ID)) return;
  const css = getZenmarkCss();

  const style = document.createElement("style");
  style.id = ZENMARK_STYLE_ID;
  style.textContent = css;
  document.head.appendChild(style);
}
