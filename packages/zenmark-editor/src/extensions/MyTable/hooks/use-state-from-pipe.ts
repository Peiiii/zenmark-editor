import xbook from "@/xbook";
import { useEffect, useState } from "react";

export const useStateFromPipe = <T = any>(id: string, defaultValue?: T) => {
  const [state, setState] = useState(defaultValue);
  useEffect(() => {
    return xbook.pipeService.on(id, (s) => {
      setState(s);
    });
  }, []);
  return state;
};
