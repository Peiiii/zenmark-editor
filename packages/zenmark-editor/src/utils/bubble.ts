import { posToDOMRect } from '@tiptap/core'
import {
  DEFAULT_BUBBLE_OFFSET,
  EDITOR_HEADER_SELECTOR,
  EDITOR_ROOT_SELECTOR,
} from '../config/ui'

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

export function clampX(x: number, pad = DEFAULT_BUBBLE_OFFSET): number {
  return Math.max(pad, Math.min(window.innerWidth - pad, x))
}

export function centerX(rect: DOMRect): number {
  return rect.left + rect.width / 2
}

export function overlayX(rect: DOMRect, pad = DEFAULT_BUBBLE_OFFSET): number {
  return clampX(Math.round(centerX(rect)), pad)
}

export function overlayY(rect: DOMRect, placement: 'top' | 'bottom', offset = 0): number {
  const base = placement === 'top' ? rect.top : rect.top + rect.height
  return base + (placement === 'top' ? -offset : offset)
}

export function decidePlacement(
  rect: DOMRect,
  headerRect: DOMRect | null,
  menuHeight: number,
  viewportHeight: number,
  offset = DEFAULT_BUBBLE_OFFSET,
): 'top' | 'bottom' {
  const topY = rect.top
  const bottomY = rect.top + rect.height
  const topFits = topY - offset - menuHeight >= 0
  const bottomFits = bottomY + offset + menuHeight <= viewportHeight

  if (headerRect) {
    const bubbleTopIfTop = topY - offset - menuHeight
    const collidesHeader = bubbleTopIfTop < headerRect.bottom
    if (collidesHeader && bottomFits) return 'bottom'
  }

  if (!topFits && bottomFits) return 'bottom'
  if (topFits && !bottomFits) return 'top'
  if (!topFits && !bottomFits) return topY < viewportHeight / 2 ? 'bottom' : 'top'
  return 'top'
}

export function getPreferredScrollContainer(view: any): HTMLElement | Window {
  const v: any = view
  return (
    v?.scrollDOM ||
    (view?.dom?.closest?.('.editor-content-wrapper') as HTMLElement) ||
    (view?.dom?.closest?.('.editor-middle') as HTMLElement) ||
    window
  )
}

export function getContainerRect(container: HTMLElement | Window): DOMRect {
  return container instanceof Window ? viewportRect() : container.getBoundingClientRect()
}

export function decidePlacementInContainer(
  rect: DOMRect,
  containerRect: DOMRect,
  headerRect: DOMRect | null,
  menuHeight: number,
  offset = DEFAULT_BUBBLE_OFFSET,
): 'top' | 'bottom' {
  const topY = rect.top
  const bottomY = rect.top + rect.height
  const topFits = topY - offset - menuHeight >= containerRect.top
  const bottomFits = bottomY + offset + menuHeight <= containerRect.bottom

  if (headerRect) {
    const bubbleTopIfTop = topY - offset - menuHeight
    const collidesHeader = bubbleTopIfTop < headerRect.bottom
    if (collidesHeader && bottomFits) return 'bottom'
  }
  if (!topFits && bottomFits) return 'bottom'
  if (topFits && !bottomFits) return 'top'
  if (!topFits && !bottomFits) return topY < (containerRect.top + containerRect.height / 2) ? 'bottom' : 'top'
  return 'top'
}

// DOM helpers around the editor/view
export function getEditorRoot(view: any): HTMLElement | null {
  return (view?.dom?.closest?.(EDITOR_ROOT_SELECTOR) as HTMLElement) || view?.dom?.parentElement || null
}

export function getEditorHeaderRect(view: any): DOMRect | null {
  const root = getEditorRoot(view)
  const header = root?.querySelector?.(EDITOR_HEADER_SELECTOR) as HTMLElement | null
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
