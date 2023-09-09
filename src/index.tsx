import React, { useCallback, useState } from "react";
import App from "./App";

export default {
  activate: (xbook: any) => {
    console.log("React:", React, "useCallback:", useCallback);
    xbook.componentService.register("tiptap-editor", ({ fid }) => {
      // console.log("[inside]React:", React, "useCallback:", useCallback);
      // const a = useState(0);
      console.log("[editor] fid:", fid);
      const readContent = useCallback(async () => {
        return await xbook.serviceBus.invoke("fileSystemService.read", fid);
      }, [fid]);
      const writeContent = useCallback(
        async (content) => {
          return await xbook.serviceBus.invoke(
            "fileSystemService.write",
            fid,
            content
          );
        },
        [fid]
      );
      return <App readContent={readContent} writeContent={writeContent} />;
    });
    xbook.serviceBus.invoke("openerService.register", {
      match: [".md", ".mpd", ".markdown"],
      init: (fid: string) => {
        xbook.layoutService.pageBox.addPage({
          id: fid,
          title: fid,
          viewData: {
            type: "tiptap-editor",
            props: {
              fid,
            },
          },
        });
      },
    });
  },
};
