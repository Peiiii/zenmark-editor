import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { dependencies } from "./package.json";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

const { resolve } = require("path");

const splitModules: string[] = [
  // "react-rnd",
  // "react-icons"
];
function renderChunks(deps: Record<string, string>) {
  let chunks: any = {};
  const addChunk = (key: string) => {
    if (key.startsWith("@types")) return;
    if (key.startsWith("remixicon")) return;
    if (["react", "react-router-dom", "react-dom"].includes(key)) return;
    chunks[key] = [key];
  };
  Object.keys(deps).forEach(addChunk);
  splitModules.forEach(addChunk);
  return chunks;
}

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
    outDir: "build/lib/tiptap-editor",
    lib: {
      entry: "src/index.tsx",
      name: "tiptap-editor",
      formats: ["es", "umd", "cjs"],
    },
    // minify: false,
    rollupOptions: {
      external: ["react", "react-dom"],
      input: "src/index.tsx",

      output: [
        {
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
          },
          format: "systemjs",
        },
        {
          format: "es",
          dir: "build/lib/tiptap-editor/es"
        },
        {
          format: "umd",
          dir: "build/lib/tiptap-editor/umd",
          name: "tiptap-editor"
        },
        {
          format: "cjs",
          dir: "build/lib/tiptap-editor/cjs",
          name: "tiptap-editor"
        }
      ]
      // manualChunks: {
      //   vendor: ['react', 'react-dom'],
      //   ...renderChunks(dependencies),
      // },
    },
  },
});
