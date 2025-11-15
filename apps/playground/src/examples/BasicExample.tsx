import { useLocalStorageString } from "../hooks/useLocalStorage";
import { DEFAULT_MARKDOWN, STORAGE_KEYS } from "../constants";
import { ZenmarkEditor } from "zenmark-editor";
import { QuickActions } from "../components/QuickActions";
import { PresetSelector } from "../components/PresetSelector";

export function BasicExample() {
  const [content, setContent] = useLocalStorageString(
    STORAGE_KEYS.CONTENT,
    DEFAULT_MARKDOWN
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
    } catch {
    }
  };

  const handleClear = () => {
    if (confirm("确定要清空内容吗？")) {
      setContent("");
    }
  };

  return (
    <div className="flex h-full w-full">
      <div className="w-1/2 flex flex-col border-r min-w-0">
        <div className="p-4 border-b flex-shrink-0 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Markdown</h1>
            <QuickActions
              actions={[
                {
                  label: "复制",
                  onClick: handleCopy,
                  variant: "outline",
                },
                {
                  label: "清空",
                  onClick: handleClear,
                  variant: "outline",
                },
              ]}
            />
          </div>
          <PresetSelector onSelect={setContent} />
        </div>
        <textarea
          className="flex-1 w-full resize-none border-0 bg-transparent p-4 text-sm font-mono focus:outline-none focus:ring-0 min-h-0"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          spellCheck={false}
          placeholder="Type Markdown here…"
        />
      </div>
      <div className="w-1/2 flex flex-col min-w-0">
        <div className="p-4 border-b flex-shrink-0">
          <h1 className="text-lg font-semibold">Preview</h1>
        </div>
        <div className="flex-1 overflow-hidden min-h-0">
          <ZenmarkEditor value={content} onChange={setContent} />
        </div>
      </div>
    </div>
  );
}

