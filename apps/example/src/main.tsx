import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import mermaid from "mermaid";

// Expose mermaid so the local workspace version of zenmark-editor
// can pick it up and apply its configuration.
if (typeof window !== "undefined") {
  (window as any).mermaid = mermaid;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
