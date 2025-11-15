import { useMemo, useState } from "react";
import { ZenmarkEditor } from "zenmark-editor";
import "./App.css";

// Minimal markdown sample to start with in the playground
const defaultMarkdown = `# Zenmark Playground

Type here or click "Push To Editor" to load the content into the editor.

- This app helps you develop and debug zenmark-editor
- Click Save inside the editor to trigger writeContent and sync back here
`;

/**
 * Simple playground wrapper which:
 * - Holds a markdown string on the left
 * - Pushes it into the editor via subscribeContent/readContent
 * - Receives "save" events from the editor via writeContent and keeps the left textarea in sync
 */
export default function App() {
  const [content, setContent] = useState<string>(defaultMarkdown);
  const [listeners, setListeners] = useState<Array<(content: string) => void>>(
    []
  );

  const onExternalPush = (next: string) => {
    setContent(next);
    // push to all subscribers (the editor registers one)
    listeners.forEach((l) => l(next));
  };

  const readContent = useMemo(() => {
    return () => Promise.resolve(content);
  }, [content]);

  const writeContent = (next: string) => {
    // Called when user hits "Save" in the editor
    onExternalPush(next);
    return Promise.resolve();
  };

  const subscribeContent = (cb: (s: string) => void) => {
    setListeners((arr) => [...arr, cb]);
    return () => setListeners((arr) => arr.filter((x) => x !== cb));
  };

  return (
    <>
      <div className="panel left">
        <div className="controls">
          <button onClick={() => onExternalPush(defaultMarkdown)}>
            Reset
          </button>
          <button
            onClick={() =>
              onExternalPush(`# Quick Test

Some inline math: $E=mc^2$

Tasks:
- [ ] Try bold
- [x] Try italic

Table:

| A | B |
|---|---|
| 1 | 2 |
`)
            }
          >
            Load Sample
          </button>
          <button onClick={() => onExternalPush(content)}>Push To Editor</button>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          spellCheck={false}
        />
      </div>
      <div className="panel" style={{ flex: 2 }}>
        <ZenmarkEditor
          readContent={readContent}
          writeContent={writeContent}
          subscribeContent={subscribeContent}
        />
      </div>
    </>
  );
}

