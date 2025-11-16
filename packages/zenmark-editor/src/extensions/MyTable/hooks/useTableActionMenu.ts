import { useState, useRef, useEffect, useCallback } from "react";
import { Editor } from "@tiptap/core";
import { selectNodeRow, selectNodeCol, selectNodeTable } from "../utils";
import { TooltipProvider } from "../TooltipProvider";
import { tableMenuManager, createMenuId } from "../utils/tableMenuManager";

export interface MenuPosition {
  x: number;
  y: number;
}

export interface UseTableActionMenuProps {
  type: "left" | "top" | "top-left";
  index: number;
  editor: Editor | undefined;
  tooltip: TooltipProvider | undefined;
}

export const useTableActionMenu = ({
  type,
  index,
  editor,
  tooltip,
}: UseTableActionMenuProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const menuId = createMenuId(type, index);

  const closeMenu = useCallback(() => {
    setShowMenu(false);
    setMenuPosition(null);
    tableMenuManager.closeMenu(menuId);
  }, [menuId]);

  useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (!target) return;
      
      const isMenuClick = menuRef.current?.contains(target);
      const isMenuElement = target.closest(".table-row-column-menu");
      const isAnyTableSelectorClick = target.closest('[class*="table-selector-"]');
      
      if (isMenuClick || isMenuElement) {
        return;
      }
      
      if (isAnyTableSelectorClick) {
        return;
      }
      
      closeMenu();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    const handleFocusChange = () => {
      if (document.activeElement && !menuRef.current?.contains(document.activeElement)) {
        const isSelectorFocused = document.activeElement.closest(`.table-selector-${type}-${index}`);
        if (!isSelectorFocused) {
          closeMenu();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside, true);
    document.addEventListener("click", handleClickOutside, true);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("blur", handleFocusChange);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("click", handleClickOutside, true);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("blur", handleFocusChange);
    };
  }, [showMenu, type, index, closeMenu]);

  const handleSelectorClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    if (type === "left") {
      editor?.view.dispatch(selectNodeRow(index)(editor?.state.tr));
      const menuWidth = 100;
      setMenuPosition({
        x: Math.max(0, rect.left - menuWidth - 4),
        y: rect.top + rect.height / 2,
      });
      tableMenuManager.openMenu(menuId, closeMenu);
      setShowMenu(true);
    } else if (type === "top") {
      editor?.view.dispatch(selectNodeCol(index)(editor?.state.tr));
      const menuHeight = 40;
      setMenuPosition({
        x: rect.left + rect.width / 2,
        y: Math.max(0, rect.top - menuHeight - 4),
      });
      tableMenuManager.openMenu(menuId, closeMenu);
      setShowMenu(true);
    } else {
      editor?.view.dispatch(selectNodeTable(editor?.state.tr));
      tooltip?.getInstance()?.setProps({
        getReferenceClientRect: () => rect,
      });
      tooltip?.show();
    }
  };

  return {
    showMenu,
    menuPosition,
    menuRef,
    selectorRef,
    handleSelectorClick,
    closeMenu,
  };
};

