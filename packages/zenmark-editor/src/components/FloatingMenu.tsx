import React from "react";

// Placeholder for Tiptap v3. The built-in FloatingMenu React component was removed.
// Our editor doesn't use this component by default (see zen-mark.tsx), so we keep
// a no-op to avoid breaking imports if enabled later.
export default function FloatingMenu() {
  return null;
}
