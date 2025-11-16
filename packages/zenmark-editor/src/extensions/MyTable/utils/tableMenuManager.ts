type MenuId = string;

class TableMenuManager {
  private openMenuId: MenuId | null = null;
  private closeCallbacks: Map<MenuId, () => void> = new Map();

  openMenu(menuId: MenuId, closeCallback: () => void) {
    if (this.openMenuId && this.openMenuId !== menuId) {
      const previousCloseCallback = this.closeCallbacks.get(this.openMenuId);
      if (previousCloseCallback) {
        previousCloseCallback();
      }
    }
    this.openMenuId = menuId;
    this.closeCallbacks.set(menuId, closeCallback);
  }

  closeMenu(menuId: MenuId) {
    if (this.openMenuId === menuId) {
      this.openMenuId = null;
    }
    this.closeCallbacks.delete(menuId);
  }

  closeAllMenus() {
    this.closeCallbacks.forEach((callback) => {
      callback();
    });
    this.openMenuId = null;
    this.closeCallbacks.clear();
  }

  isMenuOpen(menuId: MenuId): boolean {
    return this.openMenuId === menuId;
  }
}

export const tableMenuManager = new TableMenuManager();

export const createMenuId = (type: string, index: number): MenuId => {
  return `table-menu-${type}-${index}`;
};

