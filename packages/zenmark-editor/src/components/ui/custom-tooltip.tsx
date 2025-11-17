import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FC, ReactNode } from "react";

export const CustomTooltip: FC<{ title: ReactNode; children: ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          {title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
