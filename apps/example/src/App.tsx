import { ZenmarkEditor } from "zenmark-editor";
import { markdownExample } from "./markdown-example";
import { useState } from "react";

function App() {
  const [content, setContent] = useState(markdownExample);
  
  return (
    <ZenmarkEditor
      value={content}
      onChange={setContent}
    />
  );
}

export default App;
