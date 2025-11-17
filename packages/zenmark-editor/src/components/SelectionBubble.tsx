import { Editor } from '@tiptap/react'
import React, { PropsWithChildren, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { clampX, centerX } from '../utils/bubble'
import { useSelectionViewport } from '../hooks/useSelectionViewport'

type Props = PropsWithChildren<{ editor: Editor }>

// Minimal, dependency-free bubble anchored to the current selection.
// Hides when selection collapses, editor loses focus, or selection rect
// is outside the editor's visible scroll container.
export default function SelectionBubble({ editor, children }: Props) {
  // Create a container once and append to body
  const getEl = useMemo(() => {
    if (typeof document === 'undefined') return null
    const el = document.createElement('div')
    el.className = 'bubble-menu-host'
    el.style.position = 'static'
    el.style.visibility = 'hidden'
    el.style.opacity = '0'
    return el
  }, [])

  useEffect(() => {
    const el = getEl
    if (!el) return
    document.body.appendChild(el)
    return () => {
      try { el.remove() } catch { /* ignore */ }
    }
  }, [getEl])

  // Selection visibility + geometry
  const { rect, visible } = useSelectionViewport(editor)

  // Reflect visibility on host and place an anchor for children
  useEffect(() => {
    if (!getEl) return
    if (!visible || !rect) {
      getEl.style.visibility = 'hidden'
      getEl.style.opacity = '0'
      return
    }
    // Host only controls visibility; inner bubble handles absolute positioning.
    // We keep calculation here in case we want to expose anchor coords later.
    let x = Math.round(centerX(rect))
    x = clampX(x, 8)
    getEl.style.visibility = 'visible'
    getEl.style.opacity = '1'
  }, [getEl, visible, rect])

  if (!getEl) return null
  return createPortal(children, getEl)
}
