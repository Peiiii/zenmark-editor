import { cn } from "../lib/utils";

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  items: Array<{ id: string; label: string }>;
}

export function Tabs({ value, onValueChange, items }: TabsProps) {
  return (
    <div className="inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onValueChange(item.id)}
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            value === item.id
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

