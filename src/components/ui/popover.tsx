import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "tteditz-50 tteditw-72 tteditrounded-md tteditborder tteditbg-popover tteditp-4 ttedittext-popover-foreground tteditshadow-md tteditoutline-none data-[state=open]:tteditanimate-in data-[state=closed]:tteditanimate-out data-[state=closed]:tteditfade-out-0 data-[state=open]:tteditfade-in-0 data-[state=closed]:tteditzoom-out-95 data-[state=open]:tteditzoom-in-95 data-[side=bottom]:tteditslide-in-from-top-2 data-[side=left]:tteditslide-in-from-right-2 data-[side=right]:tteditslide-in-from-left-2 data-[side=top]:tteditslide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
