import { markdownPresets, type PresetKey } from "../presets/markdownPresets";
import { cn } from "../lib/utils";

interface PresetSelectorProps {
  onSelect: (content: string) => void;
  className?: string;
}

const presetLabels: Record<PresetKey, string> = {
  minimal: "最小示例",
  full: "完整演示",
  article: "文章示例",
  table: "表格演示",
  code: "代码演示",
};

export function PresetSelector({ onSelect, className }: PresetSelectorProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-sm text-muted-foreground">预设:</span>
      <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1">
        {Object.entries(markdownPresets).map(([key, content]) => (
          <button
            key={key}
            onClick={() => onSelect(content)}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-background hover:text-foreground"
          >
            {presetLabels[key as PresetKey]}
          </button>
        ))}
      </div>
    </div>
  );
}

