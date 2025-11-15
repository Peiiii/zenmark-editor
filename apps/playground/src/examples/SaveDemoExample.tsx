import { useState, useEffect, useRef, useCallback } from "react";
import { ZenmarkEditor } from "zenmark-editor";
import { cn } from "../lib/utils";
import { QuickActions } from "../components/QuickActions";
import { PresetSelector } from "../components/PresetSelector";

interface SaveRecord {
  id: string;
  timestamp: number;
  content: string;
  contentLength: number;
  wordCount: number;
}

function getWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function SaveDemoExample() {
  const [content, setContent] = useState("# Hello Zenmark\n\nStart editing...");
  const [saveHistory, setSaveHistory] = useState<SaveRecord[]>([]);
  const [lastSaveTime, setLastSaveTime] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const debounceTimerRef = useRef<number | null>(null);
  const lastSavedContentRef = useRef<string>(content);
  const isInitialMountRef = useRef(true);

  const handleSave = useCallback(async (contentToSave: string) => {
    if (contentToSave === lastSavedContentRef.current) {
      return;
    }

    if (isSaving) return;
    
    setIsSaving(true);
    setSaveStatus("saving");

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const record: SaveRecord = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        content: contentToSave,
        contentLength: contentToSave.length,
        wordCount: getWordCount(contentToSave),
      };

      setSaveHistory((prev) => [record, ...prev].slice(0, 10));
      setLastSaveTime(Date.now());
      lastSavedContentRef.current = contentToSave;
      setSaveStatus("saved");
      
      setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    } catch {
      setSaveStatus("error");
      setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    } finally {
      setIsSaving(false);
    }
  }, [isSaving]);

  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      lastSavedContentRef.current = content;
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!content || isSaving || content === lastSavedContentRef.current) {
      return;
    }

    debounceTimerRef.current = window.setTimeout(() => {
      if (content !== lastSavedContentRef.current && !isSaving) {
        handleSave(content);
      }
    }, 1000);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [content, isSaving, handleSave]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
    });
  };

  const contentLength = content.length;
  const wordCount = getWordCount(content);
  const lineCount = content.split("\n").length;

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
      <div className="w-2/3 flex flex-col border-r min-w-0">
        <div className="p-4 border-b flex-shrink-0 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Editor with Auto-Save</h1>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex items-center gap-2 text-sm",
                  saveStatus === "saving" && "text-yellow-500",
                  saveStatus === "saved" && "text-green-500",
                  saveStatus === "error" && "text-red-500",
                  saveStatus === "idle" && "text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    saveStatus === "saving" && "bg-yellow-500 animate-pulse",
                    saveStatus === "saved" && "bg-green-500",
                    saveStatus === "error" && "bg-red-500",
                    saveStatus === "idle" && "bg-muted-foreground"
                  )}
                />
                <span>
                  {saveStatus === "saving" && "保存中..."}
                  {saveStatus === "saved" && "已保存"}
                  {saveStatus === "error" && "保存失败"}
                  {saveStatus === "idle" && "就绪"}
                </span>
              </div>
              {lastSaveTime && (
                <span className="text-xs text-muted-foreground">
                  {formatTime(lastSaveTime)}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <PresetSelector onSelect={setContent} />
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
        </div>
        <div className="flex-1 overflow-hidden min-h-0">
          <ZenmarkEditor value={content} onChange={setContent} />
        </div>
      </div>
      <div className="w-1/3 flex flex-col min-w-0 bg-muted/30">
        <div className="p-4 border-b flex-shrink-0">
          <h2 className="text-sm font-semibold">数据统计</h2>
        </div>
        <div className="p-4 space-y-4 flex-shrink-0 border-b">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">字符数</div>
              <div className="text-lg font-semibold">{contentLength.toLocaleString()}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">单词数</div>
              <div className="text-lg font-semibold">{wordCount.toLocaleString()}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">行数</div>
              <div className="text-lg font-semibold">{lineCount.toLocaleString()}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">保存次数</div>
              <div className="text-lg font-semibold">{saveHistory.length}</div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto min-h-0">
          <div className="p-4 border-b flex-shrink-0 sticky top-0 bg-muted/30 backdrop-blur-sm">
            <h2 className="text-sm font-semibold">保存历史</h2>
          </div>
          <div className="p-4 space-y-2">
            {saveHistory.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-8">
                暂无保存记录
              </div>
            ) : (
              saveHistory.map((record) => (
                <div
                  key={record.id}
                  className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">
                      {formatDate(record.timestamp)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(record.timestamp)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">字符: </span>
                      <span className="font-medium">{record.contentLength}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">单词: </span>
                      <span className="font-medium">{record.wordCount}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">行: </span>
                      <span className="font-medium">
                        {record.content.split("\n").length}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground line-clamp-2">
                    {record.content.substring(0, 60)}
                    {record.content.length > 60 && "..."}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

