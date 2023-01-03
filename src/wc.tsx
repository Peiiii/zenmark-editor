import React from "react"
import * as ReactDOM from "react-dom/client"
import reactToWebComponent from "react-to-webcomponent"
import App from "./App";
// const App=()=>{
//     return <div>Tiptap Editor</div>
// }

const TiptapEditor= reactToWebComponent(App as any,React as any,ReactDOM as any);
customElements.define("tiptap-editor",TiptapEditor as any);


const hi=()=>{
    return "Hello world!";
}

export {
    hi
}