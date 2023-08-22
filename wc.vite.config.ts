import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import react from "@vitejs/plugin-react";
const { resolve } = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cssInjectedByJsPlugin()],
  base: "/tiptap-editor",
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "src"),
      },
      {
        find: "xbook",
        replacement: resolve(__dirname, "src/xbook"),
      },
    ],
  },
  define: {
    "process.env": {},
  },
  build: {
    outDir: "build/wc/tiptap-editor",
    // minify:false,
    lib: {
      entry: resolve(__dirname, "src/wc.tsx"),
      name: "TiptapEditor",
      formats: ["iife"],
      fileName: "tiptap-editor",
    },
    rollupOptions: {
      // external:["react"],
      // output:{
      //     globals:{
      //         "react":"React"
      //     }
      // }
    },
  },
});
