import { Action } from "@/actions/types";
import { FcExpand } from "react-icons/fc";
import xbook from "xbook";

export const ExpandMenuBar: Action = {
  icon: FcExpand,
  title: "Expand",
  id: "expand",
  name: "expand",
  action: (editor) =>{ xbook.serviceBus.invoke("expandMenuBar")},
};
