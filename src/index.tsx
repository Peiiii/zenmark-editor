import React, { useCallback, useState } from "react";
import App from "./App";
import xbook from "@/xbook";
import { EventKeys } from "@/tokens/eventKeys";

const plugin = {
  activate: (context: any) => {
    console.log("React:", React, "useCallback:", useCallback);
    const EditorRenderer =({ fid,uri }) => {
      // console.log("[inside]React:", React, "useCallback:", useCallback);
      // const a = useState(0);
      fid = fid || uri;
      console.log("[editor] fid:", fid);
      const readContent = useCallback(async () => {
        return await context.serviceBus.invoke("fileSystemService.read", fid);
      }, [fid]);
      const writeContent = useCallback(
        async (content) => {
          return await context.serviceBus.invoke(
            "fileSystemService.write",
            fid,
            content
          );
        },
        [fid]
      );
      return <App readContent={readContent} writeContent={writeContent} />;
    }
    context.componentService.register("tiptap-editor", EditorRenderer, true);
    context.componentService.register("markdown-editor", EditorRenderer, true);
    context.serviceBus.invoke("openerService.register", {
      match: [".md", ".mpd", ".markdown"],
      init: (fid: string) => {
        context.layoutService.pageBox.addPage({
          id: fid,
          title: fid,
          viewData: {
            type: "markdown-editor",
            props: {
              // fid,
              uri: fid,
            },
          },
        });
      },
    });

    xbook.eventBus.on(EventKeys.FileSaved, () => {
      context.eventBus.emit(EventKeys.FileSaved);
    });
  },
};

export default {
  plugin,
  Component: App,
};
