import { useState, useRef } from "react";
import { ZenmarkEditor, KeyMod, KeyCode, matchesKeybinding } from "zenmark-editor";
import { cn } from "../lib/utils";

interface KeyboardLog {
  id: string;
  timestamp: number;
  key: string;
  keyCode: number;
  modifiers: string[];
  action: string;
}

export function KeyboardEventExample() {
  const [content, setContent] = useState("# Keyboard Event Demo\n\nTry pressing keys in the editor!\n\n- Press Ctrl/Cmd+S to save\n- Press Escape to see logs\n- Press any key to see it logged");
  const [keyboardLogs, setKeyboardLogs] = useState<KeyboardLog[]>([]);
  const [lastSaveTime, setLastSaveTime] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const saveCountRef = useRef(0);

  const handleKeyDown = (event: {
    keyCode: number;
    code: string;
    key: string;
    ctrlKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
    metaKey: boolean;
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => {
    const modifiers: string[] = [];
    if (event.ctrlKey) modifiers.push("Ctrl");
    if (event.metaKey) modifiers.push("Cmd");
    if (event.shiftKey) modifiers.push("Shift");
    if (event.altKey) modifiers.push("Alt");

    const modifierStr = modifiers.length > 0 ? modifiers.join("+") + "+" : "";
    // Use code if available, fallback to key
    // Extract key name from code (e.g. "KeyS" -> "S", "Digit1" -> "1")
    let keyStr = event.key || "";
    if (event.code) {
      if (event.code.startsWith("Key")) {
        keyStr = event.code.slice(3);
      } else if (event.code.startsWith("Digit")) {
        keyStr = event.code.slice(5);
      } else {
        keyStr = event.code;
      }
    }
    if (!keyStr) {
      keyStr = `Key${event.keyCode}`;
    }

    // Skip if this is just a modifier key (Meta, Control, etc.) - these are not the actual key presses
    const isModifierKey = 
      event.key === "Meta" || 
      event.key === "MetaLeft" || 
      event.key === "MetaRight" ||
      event.key === "Control" || 
      event.key === "ControlLeft" ||
      event.key === "ControlRight" ||
      event.key === "Alt" || 
      event.key === "AltLeft" ||
      event.key === "AltRight" ||
      event.key === "Shift" ||
      event.key === "ShiftLeft" ||
      event.key === "ShiftRight" ||
      event.code === "MetaLeft" ||
      event.code === "MetaRight" ||
      event.code === "ControlLeft" ||
      event.code === "ControlRight" ||
      event.code === "AltLeft" ||
      event.code === "AltRight" ||
      event.code === "ShiftLeft" ||
      event.code === "ShiftRight";
    
    if (isModifierKey) {
      // Pure modifier key presses are noisy in logs and not useful alone.
      // Skip logging and let the actual combo key event be handled below.
      return false;
    } else {
      // Check for Ctrl/Cmd+S (Save)
      // Direct check for Ctrl/Cmd+S (more reliable)
      const isSaveShortcut = 
        (event.ctrlKey || event.metaKey) && 
        (event.keyCode === KeyCode.KEY_S || 
         event.key?.toLowerCase() === 's' || 
         event.code === 'KeyS');
      
      if (isSaveShortcut) {
        // Prevent default browser save dialog FIRST
        event.preventDefault();
        event.stopPropagation();
        // Log the save shortcut press explicitly
        const modifierStr = modifiers.length > 0 ? modifiers.join("+") + "+" : "";
        const log: KeyboardLog = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          key: keyStr,
          keyCode: event.keyCode,
          modifiers,
          action: `${modifierStr}${keyStr}`,
        };
        setKeyboardLogs((prev) => [log, ...prev].slice(0, 20));
        // Then trigger our save handler
        handleSave();
        return true;
      }
      
      // Also try matchesKeybinding for demonstration
      const saveKeybinding = KeyMod.CtrlCmd | KeyCode.KEY_S;
      if (matchesKeybinding(event as any, saveKeybinding)) {
        // Prevent default browser save dialog FIRST
        event.preventDefault();
        event.stopPropagation();
        // Log the save shortcut press explicitly
        const modifierStr = modifiers.length > 0 ? modifiers.join("+") + "+" : "";
        const log: KeyboardLog = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          key: keyStr,
          keyCode: event.keyCode,
          modifiers,
          action: `${modifierStr}${keyStr}`,
        };
        setKeyboardLogs((prev) => [log, ...prev].slice(0, 20));
        // Then trigger our save handler
        handleSave();
        return true;
      }
    }

    // Check for Escape (show logs)
    if (event.keyCode === KeyCode.Escape) {
      // Just log it, don't prevent default
    }

    // Log all keyboard events
    const log: KeyboardLog = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      key: keyStr,
      keyCode: event.keyCode,
      modifiers,
      action: `${modifierStr}${keyStr}`,
    };

    setKeyboardLogs((prev) => [log, ...prev].slice(0, 20));

    return false;
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    saveCountRef.current += 1;

    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    setLastSaveTime(Date.now());
    setSaveStatus("saved");

    setTimeout(() => {
      setSaveStatus("idle");
    }, 2000);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getKeyCodeName = (keyCode: number): string => {
    const keyMap: Record<number, string> = {
      [KeyCode.Backspace]: "Backspace",
      [KeyCode.Tab]: "Tab",
      [KeyCode.Enter]: "Enter",
      [KeyCode.Escape]: "Escape",
      [KeyCode.Space]: "Space",
      [KeyCode.PageUp]: "PageUp",
      [KeyCode.PageDown]: "PageDown",
      [KeyCode.End]: "End",
      [KeyCode.Home]: "Home",
      [KeyCode.LeftArrow]: "LeftArrow",
      [KeyCode.UpArrow]: "UpArrow",
      [KeyCode.RightArrow]: "RightArrow",
      [KeyCode.DownArrow]: "DownArrow",
      [KeyCode.Insert]: "Insert",
      [KeyCode.Delete]: "Delete",
    };

    if (keyMap[keyCode]) {
      return keyMap[keyCode];
    }

    if (keyCode >= KeyCode.KEY_0 && keyCode <= KeyCode.KEY_9) {
      return `KEY_${keyCode - KeyCode.KEY_0}`;
    }

    if (keyCode >= KeyCode.KEY_A && keyCode <= KeyCode.KEY_Z) {
      return `KEY_${String.fromCharCode(65 + (keyCode - KeyCode.KEY_A))}`;
    }

    return `Unknown(${keyCode})`;
  };

  return (
    <div className="flex h-full w-full">
      <div className="w-2/3 flex flex-col border-r min-w-0">
        <div className="p-4 border-b flex-shrink-0 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Keyboard Event Demo</h1>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex items-center gap-2 text-sm",
                  saveStatus === "saving" && "text-yellow-500",
                  saveStatus === "saved" && "text-green-500",
                  saveStatus === "idle" && "text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    saveStatus === "saving" && "bg-yellow-500 animate-pulse",
                    saveStatus === "saved" && "bg-green-500",
                    saveStatus === "idle" && "bg-muted-foreground"
                  )}
                />
                <span>
                  {saveStatus === "saving" && "保存中..."}
                  {saveStatus === "saved" && "已保存"}
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
          <div className="text-sm text-muted-foreground">
            <p>💡 提示：按 <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">Ctrl/Cmd+S</kbd> 保存，按任意键查看日志</p>
          </div>
        </div>
        <div className="flex-1 overflow-hidden min-h-0">
          <ZenmarkEditor value={content} onChange={setContent} onKeyDown={handleKeyDown} />
        </div>
      </div>
      <div className="w-1/3 flex flex-col min-w-0 bg-muted/30">
        <div className="p-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">键盘事件日志</h2>
            <button
              onClick={() => setKeyboardLogs([])}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              清空
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto min-h-0 p-4 space-y-2">
          {keyboardLogs.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">
              暂无键盘事件
              <br />
              <span className="text-xs mt-2 block">在编辑器中按键即可查看</span>
            </div>
          ) : (
            keyboardLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium">
                    {formatTime(log.timestamp)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    #{keyboardLogs.indexOf(log) + 1}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">按键:</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">
                      {log.action || log.key}
                    </kbd>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">KeyCode:</span>
                    <span className="font-mono">{getKeyCodeName(log.keyCode)}</span>
                    <span className="text-muted-foreground">({log.keyCode})</span>
                  </div>
                  {log.modifiers.length > 0 && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">修饰键:</span>
                      <div className="flex gap-1">
                        {log.modifiers.map((mod, idx) => (
                          <kbd key={idx} className="px-1 py-0.5 rounded bg-muted text-xs">
                            {mod}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t flex-shrink-0 bg-muted/30">
          <div className="text-xs text-muted-foreground space-y-1">
            <div>保存次数: <span className="font-medium text-foreground">{saveCountRef.current}</span></div>
            <div>事件总数: <span className="font-medium text-foreground">{keyboardLogs.length}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
