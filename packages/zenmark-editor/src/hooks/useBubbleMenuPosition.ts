import { useMemo, RefObject } from 'react'
import type { Editor } from '@tiptap/react'
import { decidePlacementInContainer, getContainerRect, getEditorHeaderRect, getPreferredScrollContainer, overlayX } from '../utils/bubble'
import { DEFAULT_BUBBLE_OFFSET, DEFAULT_MENU_HEIGHT } from '../config/ui'

export interface BubbleMenuPosition {
  pos: { x: number; y: number }
  placement: 'top' | 'bottom'
  visible: boolean
}

// Pure positional logic for BubbleMenu. Depends only on selection rect,
// header rect, measured menu height and viewport.
export function useBubbleMenuPosition(
  editor: Editor | null,
  rect: DOMRect | null,
  visible: boolean,
  menuRef: RefObject<HTMLElement>,
  offset = DEFAULT_BUBBLE_OFFSET,
  measuredHeight?: number,
): BubbleMenuPosition {
  const headerRect = useMemo(() => (editor ? getEditorHeaderRect((editor.view as any)) : null), [editor])
  const containerRect = useMemo(() => {
    if (!editor) return null
    const container = getPreferredScrollContainer((editor.view as any))
    return getContainerRect(container)
  }, [editor, rect])

  return useMemo(() => {
    if (!visible || !rect) {
      return { pos: { x: 0, y: 0 }, placement: 'top', visible: false }
    }
    const menuH = (measuredHeight && measuredHeight > 0
      ? measuredHeight
      : (menuRef.current?.offsetHeight as number) || DEFAULT_MENU_HEIGHT)
    const placement = decidePlacementInContainer(
      rect,
      containerRect || getContainerRect(window),
      headerRect,
      menuH,
      offset,
    )
    const x = overlayX(rect, 8)
    const yBase = placement === 'top' ? rect.top : rect.top + rect.height
    return { pos: { x, y: yBase }, placement, visible: true }
  }, [visible, rect, headerRect, containerRect, measuredHeight, menuRef.current, offset])
}
