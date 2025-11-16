import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const zenmarkEditorSrc = resolve(__dirname, '../../packages/zenmark-editor/src')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: 'zenmark-editor',
        replacement: resolve(zenmarkEditorSrc, 'index.tsx'),
      },
      {
        find: /^@\/(.*)/,
        replacement: resolve(zenmarkEditorSrc, '$1'),
      },
      {
        find: /^xbook\/(.*)/,
        replacement: resolve(zenmarkEditorSrc, 'xbook/$1'),
      },
      {
        find: 'xbook',
        replacement: resolve(zenmarkEditorSrc, 'xbook'),
      },
    ],
  },
})

