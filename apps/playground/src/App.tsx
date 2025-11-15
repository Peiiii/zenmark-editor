import { useLocalStorageString } from "./hooks/useLocalStorage";
import { useContentSync } from "./hooks/useContentSync";
import { DEFAULT_MARKDOWN, STORAGE_KEYS } from "./constants";
import { ZenmarkEditor } from "zenmark-editor";

export default function App() {
  const [content, setContent] = useLocalStorageString(
    STORAGE_KEYS.CONTENT,
    DEFAULT_MARKDOWN
  );

  const { readContent, writeContent, subscribeContent, pushToSubscribers } =
    useContentSync(content);

  const handleContentChange = (next: string) => {
    setContent(next);
    pushToSubscribers(next);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground">
      <div className="flex h-full w-full">
        <div className="w-1/2 flex flex-col border-r min-w-0">
          <div className="p-4 border-b flex-shrink-0">
            <h1 className="text-lg font-semibold">Markdown</h1>
          </div>
          <textarea
            className="flex-1 w-full resize-none border-0 bg-transparent p-4 text-sm font-mono focus:outline-none focus:ring-0 min-h-0"
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            spellCheck={false}
            placeholder="Type Markdown here…"
          />
        </div>
        <div className="w-1/2 flex flex-col min-w-0">
          <div className="p-4 border-b flex-shrink-0">
            <h1 className="text-lg font-semibold">Preview</h1>
          </div>
          <div className="flex-1 overflow-hidden min-h-0">
            <ZenmarkEditor
              readContent={readContent}
              writeContent={writeContent}
              subscribeContent={subscribeContent}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
