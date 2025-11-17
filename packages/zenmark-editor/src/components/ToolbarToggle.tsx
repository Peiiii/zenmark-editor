import React, { useEffect, useMemo } from 'react'
import type { Editor } from '@tiptap/react'
import MenuItem from '@/components/MenuItem'
import { ExpandMenuBar } from '@/actions/page'
import {
  DEFAULT_BUBBLE_Z_INDEX,
  EDITOR_ROOT_SELECTOR,
  TOOLBAR_TOGGLE_OFFSET_RIGHT,
  TOOLBAR_TOGGLE_OFFSET_TOP,
} from '../config/ui'
import { getScrollableAncestors } from '../utils/bubble'
import { createPortal } from 'react-dom'

interface Props {
  editor: Editor
  collapsed: boolean
  onToggle: (next: boolean) => void
}

// A persistent top-right toggle aligned to the editor container border.
// Uses position: fixed with coordinates derived from editor's bounding rect,
// so it does not drift when the header collapses/expands.
export default function ToolbarToggle({ editor, collapsed, onToggle }: Props) {
  const host = useMemo(() => {
    if (typeof document === 'undefined') return null
    const el = document.createElement('div')
    el.className = 'editor-toolbar-toggle-host'
    el.style.position = 'fixed'
    el.style.zIndex = String(DEFAULT_BUBBLE_Z_INDEX + 1)
    el.style.pointerEvents = 'auto'
    return el
  }, [])

  // Mount host only when collapsed
  useEffect(() => {
    if (!host) return
    if (!collapsed) {
      try { host.remove() } catch {}
      return
    }
    document.body.appendChild(host)
    return () => {
      try { host.remove() } catch {}
    }
  }, [host, collapsed])

  useEffect(() => {
    if (!host || !editor?.view?.dom) return
    const view: any = editor.view
    const root: HTMLElement | null = (view.dom.closest?.(EDITOR_ROOT_SELECTOR) as HTMLElement) || view.dom.parentElement

    const update = () => {
      const rect = root?.getBoundingClientRect()
      if (!rect) return
      // compute inside-right alignment accounting for host width
      const w = host.offsetWidth || 0
      const top = Math.max(0, rect.top + TOOLBAR_TOGGLE_OFFSET_TOP)
      const left = Math.round(rect.right - TOOLBAR_TOGGLE_OFFSET_RIGHT - w)
      host.style.top = `${top}px`
      host.style.left = `${left}px`
    }

    const tick = () => requestAnimationFrame(update)
    if (collapsed) update()

    const scrollers = new Set<EventTarget>([window, ...getScrollableAncestors(view.dom)])
    if (collapsed) {
      scrollers.forEach(t => (t as any).addEventListener?.('scroll', tick, { passive: true }))
      window.addEventListener('resize', tick)
    }

    return () => {
      scrollers.forEach(t => (t as any).removeEventListener?.('scroll', tick))
      window.removeEventListener('resize', tick)
    }
  }, [host, editor, collapsed])

  if (!host || !collapsed) return null

  return createPortal(
    <MenuItem
      editor={editor}
      {...ExpandMenuBar}
      action={() => {
        onToggle(false)
        return true
      }}
    />,
    host,
  )
}
