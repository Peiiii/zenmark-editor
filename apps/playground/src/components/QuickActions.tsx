import { cn } from "../lib/utils";

interface QuickAction {
  label: string;
  icon?: string;
  onClick: () => void;
  variant?: "default" | "outline" | "ghost";
}

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

export function QuickActions({ actions, className }: QuickActionsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            action.variant === "outline" &&
              "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            action.variant === "ghost" &&
              "hover:bg-accent hover:text-accent-foreground",
            !action.variant &&
              "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {action.icon && <span className="mr-1.5">{action.icon}</span>}
          {action.label}
        </button>
      ))}
    </div>
  );
}

