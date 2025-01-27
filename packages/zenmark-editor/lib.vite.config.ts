import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import { dependencies } from "./package.json";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import dts from "vite-plugin-dts";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

const { resolve } = require("path");

// const splitModules: string[] = [
//   // "react-rnd",
//   // "react-icons"
// ];
// function renderChunks(deps: Record<string, string>) {
//   let chunks: any = {};
//   const addChunk = (key: string) => {
//     if (key.startsWith("@types")) return;
//     if (key.startsWith("remixicon")) return;
//     if (["react", "react-router-dom", "react-dom"].includes(key)) return;
//     chunks[key] = [key];
//   };
//   Object.keys(deps).forEach(addChunk);
//   splitModules.forEach(addChunk);
//   return chunks;
// }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    cssInjectedByJsPlugin(), 
    dts({
      rollupTypes: true,
      tsconfigPath: './tsconfig.json',
      outDir: ['dist/es', 'dist/cjs', 'dist/umd'],
      insertTypesEntry: true,
    })
  ],
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
    lib: {
      entry: "src/index.tsx",
      name: "zenmark-editor",
      formats: ["es", "umd", "cjs"],
    },
    // minify: false,
    rollupOptions: {
      plugins: [
        peerDepsExternal(),
      ],
      input: "src/index.tsx",
      output: [
        {
          format: "es",
          dir: "dist/es",
          entryFileNames: 'index.js',
        },
        {
          format: "umd",
          dir: "dist/umd",
          entryFileNames: 'index.js',
          name: "zenmark-editor",
        },
        {
          format: "cjs",
          dir: "dist/cjs",
          entryFileNames: 'index.js',
          name: "zenmark-editor",
        },
      ],
      // manualChunks: {
      //   vendor: ['react', 'react-dom'],
      //   ...renderChunks(dependencies),
      // },
    },
  },
});
