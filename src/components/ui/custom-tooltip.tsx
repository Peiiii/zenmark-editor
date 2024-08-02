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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="p-1 text-white bg-gray-800 dark:bg-gray-700 rounded-md text-sm">
          {title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
