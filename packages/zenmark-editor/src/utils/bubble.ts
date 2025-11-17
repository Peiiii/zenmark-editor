import { posToDOMRect } from '@tiptap/core'

// Geometry helpers for bubble/selection UI

export function getSelectionRect(view: any, from: number, to: number): DOMRect {
  return posToDOMRect(view, from, to)
}

export function viewportRect(): DOMRect {
  return new DOMRect(0, 0, window.innerWidth, window.innerHeight)
}

export function rectIntersects(a: DOMRect, b: DOMRect): boolean {
  return !(
    a.bottom <= b.top ||
    a.top >= b.bottom ||
    a.right <= b.left ||
    a.left >= b.right
  )
}

export function clampX(x: number, pad = 8): number {
  return Math.max(pad, Math.min(window.innerWidth - pad, x))
}

export function centerX(rect: DOMRect): number {
  return rect.left + rect.width / 2
}

// DOM helpers around the editor/view
export function getEditorRoot(view: any): HTMLElement | null {
  return (view?.dom?.closest?.('.editor') as HTMLElement) || view?.dom?.parentElement || null
}

export function getEditorHeaderRect(view: any): DOMRect | null {
  const root = getEditorRoot(view)
  const header = root?.querySelector?.('.editor-header') as HTMLElement | null
  if (!header) return null
  try {
    return header.getBoundingClientRect()
  } catch {
    return null
  }
}

export function getScrollableAncestors(el: Element | null): (HTMLElement | Window)[] {
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

export function rectVisibleInAll(rect: DOMRect, containers: (HTMLElement | Window)[]): boolean {
  return containers.every(container => {
    const r = container instanceof Window ? viewportRect() : (container as HTMLElement).getBoundingClientRect()
    return rectIntersects(rect, r)
  })
}

