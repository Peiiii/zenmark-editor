import { Editor } from '@tiptap/react'
import React, { PropsWithChildren, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { CellSelection } from '@tiptap/pm/tables'
import { clampX, centerX, getScrollableAncestors, getSelectionRect, rectVisibleInAll } from '../utils/bubble'

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

  // Selection / focus / transaction updates
  useEffect(() => {
    if (!editor || !getEl) return
    const view: any = editor.view as any

    const update = () => {
      const el = getEl!
      const state = editor.state
      const { selection } = state

      // Basic checks
      const active = (typeof document !== 'undefined') ? document.activeElement : null
      const isChildOfMenu = !!(active && el.contains(active))
      const hasFocus = view.hasFocus() || isChildOfMenu
      const isCollapsed = selection.from === selection.to
      if (!hasFocus || isCollapsed || !editor.isEditable || selection instanceof CellSelection) {
        el.style.visibility = 'hidden'
        el.style.opacity = '0'
        return
      }

      // Compute selection rect
      let rect: DOMRect
      try {
        rect = getSelectionRect(view, selection.from, selection.to)
      } catch {
        el.style.visibility = 'hidden'
        el.style.opacity = '0'
        return
      }

      // Determine visibility within all scrollable ancestors (and viewport)
      const containers = getScrollableAncestors(view.dom)
      const visibleInAll = rectVisibleInAll(rect, containers)

      if (!visibleInAll) {
        el.style.visibility = 'hidden'
        el.style.opacity = '0'
        return
      }

      // Position near selection center
      let x = Math.round(centerX(rect))
      let y = Math.round(rect.top)
      // Clamp X inside viewport with small padding
      x = clampX(x, 8)

      el.style.left = `${x}px`
      el.style.top = `${y}px`
      el.style.visibility = 'visible'
      el.style.opacity = '1'
    }

    const onSelectionUpdate = () => requestAnimationFrame(update)
    const onTrans = () => requestAnimationFrame(update)
    const onFocus = () => requestAnimationFrame(update)
    const onBlur = () => requestAnimationFrame(update)

    editor.on('selectionUpdate', onSelectionUpdate)
    editor.on('transaction', onTrans)
    editor.on('focus', onFocus)
    editor.on('blur', onBlur)

    // Scroll containers and window resize
    // Collect scrollables dynamically, to handle nested containers reliably
    const scrollers = new Set<EventTarget>(getScrollableAncestors(view.dom))
    // Also add all descendants with class .scroll (project convention)
    const root = (view.dom?.closest?.('.editor') as HTMLElement) || view.dom?.parentElement || undefined
    root?.querySelectorAll('.scroll').forEach(el => scrollers.add(el))

    const onScroll = () => requestAnimationFrame(update)
    const onResize = () => requestAnimationFrame(update)
    scrollers.forEach(t => (t as any).addEventListener?.('scroll', onScroll, { passive: true }))
    window.addEventListener('resize', onResize)

    // Kick first position
    update()

    return () => {
      editor.off('selectionUpdate', onSelectionUpdate)
      editor.off('transaction', onTrans)
      editor.off('focus', onFocus)
      editor.off('blur', onBlur)
      scrollers.forEach(t => (t as any).removeEventListener?.('scroll', onScroll))
      window.removeEventListener('resize', onResize)
    }
  }, [editor])

  if (!getEl) return null
  return createPortal(children, getEl)
}
