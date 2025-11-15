/**
 * Keyboard event utilities
 * Similar to Monaco Editor's KeyMod and KeyCode
 */

export enum KeyMod {
  CtrlCmd = (1 << 11) >>> 0,
  Shift = (1 << 10) >>> 0,
  Alt = (1 << 9) >>> 0,
  WinCtrl = (1 << 12) >>> 0,
}

export enum KeyCode {
  Unknown = 0,
  Backspace = 1,
  Tab = 2,
  Enter = 3,
  Escape = 4,
  Space = 5,
  PageUp = 6,
  PageDown = 7,
  End = 8,
  Home = 9,
  LeftArrow = 10,
  UpArrow = 11,
  RightArrow = 12,
  DownArrow = 13,
  Insert = 14,
  Delete = 15,
  KEY_0 = 16,
  KEY_1 = 17,
  KEY_2 = 18,
  KEY_3 = 19,
  KEY_4 = 20,
  KEY_5 = 21,
  KEY_6 = 22,
  KEY_7 = 23,
  KEY_8 = 24,
  KEY_9 = 25,
  KEY_A = 26,
  KEY_B = 27,
  KEY_C = 28,
  KEY_D = 29,
  KEY_E = 30,
  KEY_F = 31,
  KEY_G = 32,
  KEY_H = 33,
  KEY_I = 34,
  KEY_J = 35,
  KEY_K = 36,
  KEY_L = 37,
  KEY_M = 38,
  KEY_N = 39,
  KEY_O = 40,
  KEY_P = 41,
  KEY_Q = 42,
  KEY_R = 43,
  KEY_S = 44,
  KEY_T = 45,
  KEY_U = 46,
  KEY_V = 47,
  KEY_W = 48,
  KEY_X = 49,
  KEY_Y = 50,
  KEY_Z = 51,
}

export interface KeyboardEventData {
  keyCode: KeyCode;
  code: string;
  key: string;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  preventDefault: () => void;
  stopPropagation: () => void;
}

/**
 * Convert native keyboard event to our KeyboardEventData format
 */
export function createKeyboardEvent(e: React.KeyboardEvent | globalThis.KeyboardEvent): KeyboardEventData {
  const key = e.key?.toLowerCase() || "";
  const code = e.code || "";
  const codeLower = code.toLowerCase();
  let keyCode = KeyCode.Unknown;

  // First try to use code (more reliable, e.g. "KeyS" for S key)
  // Code format: "KeyS", "KeyA", "Digit1", etc.
  if (codeLower.startsWith("key")) {
    const keyChar = codeLower.slice(3); // Remove "Key" prefix
    if (keyChar.length === 1) {
      const charCode = keyChar.charCodeAt(0);
      if (charCode >= 97 && charCode <= 122) {
        keyCode = KeyCode.KEY_A + (charCode - 97);
      } else if (charCode >= 48 && charCode <= 57) {
        keyCode = KeyCode.KEY_0 + (charCode - 48);
      }
    }
  } else if (codeLower.startsWith("digit")) {
    // Handle "Digit1", "Digit2", etc.
    const digit = codeLower.slice(5);
    if (digit.length === 1 && digit >= "0" && digit <= "9") {
      keyCode = KeyCode.KEY_0 + (digit.charCodeAt(0) - 48);
    }
  }

  // Fallback to key if code didn't work
  if (keyCode === KeyCode.Unknown && key.length === 1) {
    const charCode = key.charCodeAt(0);
    if (charCode >= 97 && charCode <= 122) {
      keyCode = KeyCode.KEY_A + (charCode - 97);
    } else if (charCode >= 48 && charCode <= 57) {
      keyCode = KeyCode.KEY_0 + (charCode - 48);
    }
  }

  // Map special keys by code or key
  if (keyCode === KeyCode.Unknown) {
    const keyMap: Record<string, KeyCode> = {
      backspace: KeyCode.Backspace,
      tab: KeyCode.Tab,
      enter: KeyCode.Enter,
      escape: KeyCode.Escape,
      esc: KeyCode.Escape,
      space: KeyCode.Space,
      pageup: KeyCode.PageUp,
      pagedown: KeyCode.PageDown,
      end: KeyCode.End,
      home: KeyCode.Home,
      arrowleft: KeyCode.LeftArrow,
      arrowup: KeyCode.UpArrow,
      arrowright: KeyCode.RightArrow,
      arrowdown: KeyCode.DownArrow,
      insert: KeyCode.Insert,
      delete: KeyCode.Delete,
    };
    
    // Try code first (e.g. "Backspace", "Enter")
    if (code && keyMap[code]) {
      keyCode = keyMap[code];
    } else if (key && keyMap[key]) {
      keyCode = keyMap[key];
    }
  }

  return {
    keyCode,
    code: e.code || "",
    key: e.key || "",
    ctrlKey: e.ctrlKey || false,
    shiftKey: e.shiftKey || false,
    altKey: e.altKey || false,
    metaKey: e.metaKey || false,
    preventDefault: () => e.preventDefault(),
    stopPropagation: () => e.stopPropagation(),
  };
}

/**
 * Check if a keyboard event matches a keybinding
 * Similar to Monaco Editor's keybinding matching
 */
export function matchesKeybinding(
  event: KeyboardEventData,
  keybinding: number
): boolean {
  const keyCode = keybinding & 0x0000ffff;
  const modifiers = keybinding & 0xffff0000;

  if (event.keyCode !== keyCode) {
    return false;
  }

  const needsCtrlCmd = !!(modifiers & KeyMod.CtrlCmd);
  const needsShift = !!(modifiers & KeyMod.Shift);
  const needsAlt = !!(modifiers & KeyMod.Alt);
  const needsWinCtrl = !!(modifiers & KeyMod.WinCtrl);

  // CtrlCmd matches either Ctrl (Windows/Linux) or Cmd (Mac)
  const hasCtrlCmd = event.ctrlKey || event.metaKey;
  const hasShift = event.shiftKey;
  const hasAlt = event.altKey;
  const hasWinCtrl = event.metaKey; // WinCtrl is typically metaKey

  // Check if modifiers match
  // For CtrlCmd: if needed, must have Ctrl or Meta; if not needed, must not have either
  if (needsCtrlCmd) {
    if (!hasCtrlCmd) return false;
  } else {
    if (hasCtrlCmd) return false;
  }

  if (needsShift !== hasShift) return false;
  if (needsAlt !== hasAlt) return false;
  if (needsWinCtrl !== hasWinCtrl) return false;

  return true;
}

