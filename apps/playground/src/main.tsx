import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './globals.css'
// Bring in editor styles during local dev to ensure correct appearance
import { ensureZenmarkStylesInjected } from 'zenmark-editor/src/styles.tsx'
import App from './App.tsx'

ensureZenmarkStylesInjected()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
