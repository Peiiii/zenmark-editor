import { useMemo, RefObject } from 'react'
import type { Editor } from '@tiptap/react'
import { decidePlacement, getEditorHeaderRect, overlayX } from '../utils/bubble'
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
): BubbleMenuPosition {
  const headerRect = useMemo(() => (editor ? getEditorHeaderRect((editor.view as any)) : null), [editor])

  return useMemo(() => {
    if (!visible || !rect) {
      return { pos: { x: 0, y: 0 }, placement: 'top', visible: false }
    }
    const menuH = (menuRef.current?.offsetHeight as number) || DEFAULT_MENU_HEIGHT
    const placement = decidePlacement(rect, headerRect, menuH, window.innerHeight, offset)
    const x = overlayX(rect, 8)
    const yBase = placement === 'top' ? rect.top : rect.top + rect.height
    return { pos: { x, y: yBase }, placement, visible: true }
  }, [visible, rect, headerRect, menuRef.current, offset])
}
