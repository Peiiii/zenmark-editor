import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

// Wrap content in a Portal to escape parent stacking/overflow contexts.
type TooltipContentProps = React.ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Content
> & {
  // Optional container to mount into; defaults to document.body.
  container?: HTMLElement | null
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, sideOffset = 8, container, ...props }, ref) => (
  <TooltipPrimitive.Portal container={container}>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-[9999] max-w-xs rounded-lg border border-border/50 bg-popover text-xs font-medium text-popover-foreground shadow-lg backdrop-blur-sm animate-in fade-in-0 zoom-in-95 duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-150 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1",
        className
      )}
      style={{
        padding: "0.25rem 0.5rem",
        ...props.style,
      }}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
