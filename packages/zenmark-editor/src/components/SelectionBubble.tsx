import { Editor } from '@tiptap/react'
import { posToDOMRect } from '@tiptap/core'
import React, { PropsWithChildren, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { CellSelection } from '@tiptap/pm/tables'

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

    const getScrollableAncestors = (el: Element | null): (HTMLElement | Window)[] => {
      const list: (HTMLElement | Window)[] = []
      let cur: Element | null = el
      while (cur) {
        const parent = cur.parentElement
        if (!parent) break
        const style = window.getComputedStyle(parent)
        const overflowY = style.overflowY
        const overflowX = style.overflowX
        const overflow = style.overflow
        const scrollable = /(auto|scroll|overlay)/.test(`${overflow}${overflowX}${overflowY}`)
        if (scrollable && (parent.scrollHeight > parent.clientHeight || parent.scrollWidth > parent.clientWidth)) {
          list.push(parent)
        }
        cur = parent
      }
      if (list.length === 0) list.push(window)
      return list
    }

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
        rect = posToDOMRect(view, selection.from, selection.to)
      } catch {
        el.style.visibility = 'hidden'
        el.style.opacity = '0'
        return
      }

      // Determine visibility within all scrollable ancestors (and viewport)
      const containers = getScrollableAncestors(view.dom)
      const visibleInAll = containers.every(container => {
        const containerRect = container instanceof Window
          ? new DOMRect(0, 0, window.innerWidth, window.innerHeight)
          : (container as HTMLElement).getBoundingClientRect()
        const intersects = !(
          rect.bottom <= containerRect.top ||
          rect.top >= containerRect.bottom ||
          rect.right <= containerRect.left ||
          rect.left >= containerRect.right
        )
        return intersects
      })

      if (!visibleInAll) {
        el.style.visibility = 'hidden'
        el.style.opacity = '0'
        return
      }

      // Position near selection center
      const centerX = rect.left + rect.width / 2
      let x = Math.round(centerX)
      let y = Math.round(rect.top)
      // Clamp X inside viewport with small padding
      const pad = 8
      x = Math.max(pad, Math.min(window.innerWidth - pad, x))

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
