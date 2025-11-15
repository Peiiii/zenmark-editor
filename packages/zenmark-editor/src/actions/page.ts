import { Action } from "@/actions/types";
import { FcExpand } from "react-icons/fc";

export const ExpandMenuBar: Action = {
  icon: FcExpand,
  title: "Expand",
  id: "expand",
  name: "expand",
  // action will be overridden in zen-mark.tsx
  action: () => true,
};
