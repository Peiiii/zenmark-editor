import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { dependencies } from './package.json';
const { resolve } = require('path');

const splitModules: string[] = [
  // "react-rnd",
  // "react-icons"
];
function renderChunks(deps: Record<string, string>) {
  let chunks: any = {};
  const addChunk = (key: string) => {
    if (key.startsWith("@types")) return;
    if (key.startsWith("remixicon")) return;
    if (['react', 'react-router-dom', 'react-dom'].includes(key)) return;
    chunks[key] = [key];
  }
  Object.keys(deps).forEach(addChunk);
  splitModules.forEach(addChunk);
  return chunks;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base:"/tiptap-editor",
  resolve:{
    alias:[
      {
        find: "@",
        replacement: resolve(__dirname,"src")
      }
    ]
  },
  build:{
    outDir:"build/tiptap-editor",
    rollupOptions:{
      output:{
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ...renderChunks(dependencies),
        },
      }
    }
  }
})
