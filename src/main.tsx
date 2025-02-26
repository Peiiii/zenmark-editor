import React from "react";
import ReactDOM from "react-dom/client";
import { ZenmarkEditor } from "zenmark-editor";
import { initialContent } from "./initialize";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ZenmarkEditor readContent={() => Promise.resolve(initialContent)} />
  </React.StrictMode>
);
