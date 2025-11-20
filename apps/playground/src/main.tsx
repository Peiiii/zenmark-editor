import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./globals.css";
// Bring in editor styles during local dev to ensure correct appearance
import { ensureZenmarkStylesInjected } from "zenmark-editor";
import App from "./App.tsx";
import mermaid from "mermaid";

// Expose mermaid on window so zenmark-editor can detect and use it
if (typeof window !== "undefined") {
  (window as any).mermaid = mermaid;
}

ensureZenmarkStylesInjected();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
