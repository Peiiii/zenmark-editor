import { useEffect, useMemo, useState } from 'react'
import type { Editor } from '@tiptap/react'
import { CellSelection } from '@tiptap/pm/tables'
import {
  getScrollableAncestors,
  getSelectionRect,
  rectVisibleInAll,
} from '../utils/bubble'
import { EDITOR_ROOT_SELECTOR, PROJECT_SCROLL_SELECTOR } from '../config/ui'

export interface SelectionViewport {
  rect: DOMRect | null
  visible: boolean
}

// Observe editor selection and relevant scroll containers; compute the
// current selection rect (viewport coordinates) and whether it is visible
// within all scrollable ancestors.
export function useSelectionViewport(editor: Editor | null): SelectionViewport {
  const [state, setState] = useState<SelectionViewport>({ rect: null, visible: false })

  // Cache references that don't change across updates
  const view = editor?.view as any

  const scrollers = useMemo(() => {
    if (!view?.dom) return [window] as (HTMLElement | Window)[]
    // Event targets: all scrollable ancestors + window + known project scrollables
    const targets = new Set<HTMLElement | Window>(getScrollableAncestors(view.dom))
    targets.add(window)
    const root = (view.dom?.closest?.(EDITOR_ROOT_SELECTOR) as HTMLElement) || view.dom?.parentElement || undefined
    root?.querySelectorAll(PROJECT_SCROLL_SELECTOR).forEach(el => targets.add(el as HTMLElement))
    return Array.from(targets)
  }, [view?.dom])

  useEffect(() => {
    if (!editor || !view) return

    const compute = () => {
      const { selection } = editor.state

      // Basic validity checks
      const isCollapsed = selection.from === selection.to
      const active = typeof document !== 'undefined' ? document.activeElement : null
      const hasFocus = view.hasFocus() || (active && (view.dom?.parentElement?.contains(active) || false))
      if (!hasFocus || isCollapsed || !editor.isEditable || selection instanceof CellSelection) {
        setState({ rect: null, visible: false })
        return
      }

      // Compute selection rect; bail out on failure
      let rect: DOMRect
      try {
        rect = getSelectionRect(view, selection.from, selection.to)
      } catch {
        setState({ rect: null, visible: false })
        return
      }

      // Visibility containers: only ancestors + window (elements that actually clip)
      const containers = [...getScrollableAncestors(view.dom), window]
      const visible = rectVisibleInAll(rect, containers)
      setState({ rect, visible })
    }

    const onTick = () => requestAnimationFrame(compute)

    // Initial
    compute()
    // Editor events
    editor.on('selectionUpdate', onTick)
    editor.on('transaction', onTick)
    editor.on('focus', onTick)
    editor.on('blur', onTick)
    // Scroll/resize
    scrollers.forEach(t => (t as any).addEventListener?.('scroll', onTick, { passive: true }))
    window.addEventListener('resize', onTick)

    return () => {
      editor.off('selectionUpdate', onTick)
      editor.off('transaction', onTick)
      editor.off('focus', onTick)
      editor.off('blur', onTick)
      scrollers.forEach(t => (t as any).removeEventListener?.('scroll', onTick))
      window.removeEventListener('resize', onTick)
    }
  }, [editor, view, scrollers])

  return state
}
