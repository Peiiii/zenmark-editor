# Styling Architecture Guide

## Overview

The Zenmark Editor uses a unified styling system that combines Tailwind CSS with SCSS, following best practices for maintainability and consistency.

## Core Principles

### 1. Unified Theme System
- All theme variables are centralized in `src/css/variables.scss`
- Uses CSS custom properties (CSS variables) for dynamic theming
- Supports both light and dark modes
- Integrates seamlessly with Tailwind CSS

### 2. Variable Naming Convention

#### Standard Tailwind Variables
```scss
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--primary: 222.2 47.4% 11.2%;
// ... other standard variables
```

#### Editor-Specific Variables
```scss
--editor-bg-base: 0 0% 100%;
--editor-bg: 0 0% 95.3%;
--editor-bg-header: 0 0% 100%;
--editor-bg-inner: 0 0% 100%;
--editor-text-base: 0 0% 5.1%;
--editor-text: 0 0% 5.1%;
--editor-text-footer: 0 0% 5.1%;
```

### 3. Style File Organization

```
src/css/
├── index.scss                        # Main entry point
├── variables.scss                    # Theme variables
├── base/                             # Base application styles
│   ├── _index.scss                  # Base imports
│   ├── app.scss                     # App-level styles
│   └── editor.scss                  # Editor-specific styles
├── components/                       # Component styles
│   ├── _index.scss                  # Component imports
│   ├── character-count.scss
│   ├── code-block.scss
│   ├── color-highlighter.scss
│   ├── extension-code.scss
│   ├── force-title.scss
│   ├── iframe.scss
│   ├── math-display.scss
│   ├── menu-bar.scss
│   ├── menu-item.scss
│   ├── menus.scss
│   ├── table.scss
│   └── task-list.scss
├── utilities/                        # Utility styles
│   ├── _index.scss                  # Utility imports
│   ├── focus.scss
│   └── scroll.scss
└── themes/                           # Theme styles
    ├── _index.scss                  # Theme imports
    ├── basic.scss
    ├── github-markdown.scss
    ├── prose-mirror-lists.scss
    └── themeable-light.scss
```

**Organization Principles:**
- **Clear Hierarchy**: Each category has its own directory
- **Index Files**: Each directory has an `_index.scss` that imports all files
- **Consistent Naming**: Files use kebab-case naming convention
- **Easy Navigation**: Find any style file by its category

### 4. Import Order

The styles are loaded through a hierarchical import system (defined in `src/css/index.scss`):

```scss
// index.scss
@tailwind base;
@tailwind components;
@tailwind utilities;

@import './variables';           // 1. Theme variables first
@import './base/_index';         // 2. Base application styles
@import './components/_index';   // 3. Component-specific styles
@import './utilities/_index';    // 4. Utility styles
@import './themes/_index';       // 5. Theme styles last
```

Each directory has its own `_index.scss` that manages imports:

```scss
// base/_index.scss
@import './app.scss';
@import './editor.scss';

// components/_index.scss
@import './force-title.scss';
@import './task-list.scss';
@import './character-count.scss';
// ... other components

// utilities/_index.scss
@import './focus.scss';
@import './scroll.scss';

// themes/_index.scss
@import './basic.scss';
@import './prose-mirror-lists.scss';
```

This order ensures:
- Tailwind utilities are loaded first
- Variables are available to all components
- Base styles provide foundation
- Component styles can override base styles
- Utility styles provide helper classes
- Theme styles are applied last for proper cascading

**Benefits of Directory-Based Organization:**
- **Maintainability**: Easy to add/remove style files
- **Clarity**: Clear separation by category
- **Scalability**: Each category can grow independently
- **Navigation**: Quick file discovery by category

## Usage Guidelines

### Using Theme Variables

#### In SCSS Files
```scss
.my-component {
  background-color: hsl(var(--editor-bg));
  color: hsl(var(--editor-text));
  border-color: hsl(var(--border));
}
```

#### In Tailwind Classes
The Tailwind config exposes editor-specific colors:

```tsx
<div className="bg-editor-bg text-editor-text">
  Content
</div>
```

### Dark Mode Support

Both dark mode mechanisms are supported:

1. **Class-based**: `.dark`
2. **Attribute-based**: `[data-theme="dark"]`

```tsx
// Using class
<html className="dark">

// Using attribute
<html data-theme="dark">
```

### Component Scoping

To avoid style pollution, component-specific styles should be scoped:

```scss
.zenmark-table {
  .table-control-w-3 {
    width: 0.7rem;
  }
  // ... other styles
}
```

## Tailwind Configuration

The `tailwind.config.js` is configured to:

1. Support dual dark mode triggers
2. Scan all relevant files for Tailwind classes
3. Extend with editor-specific colors
4. Provide consistent design tokens

```javascript
module.exports = {
  darkMode: ["class", "[data-theme='dark']"],
  content: [
    "./src/**/*.{ts,tsx,scss}",
  ],
  theme: {
    extend: {
      colors: {
        editor: {
          bg: {
            base: "hsl(var(--editor-bg-base))",
            DEFAULT: "hsl(var(--editor-bg))",
            header: "hsl(var(--editor-bg-header))",
            inner: "hsl(var(--editor-bg-inner))",
          },
          text: {
            base: "hsl(var(--editor-text-base))",
            DEFAULT: "hsl(var(--editor-text))",
            footer: "hsl(var(--editor-text-footer))",
          },
        },
      },
    },
  },
}
```

## Migration from Legacy System

### Old Approach (Deprecated)
```scss
// Multiple theme variables scattered across files
[data-theme="light"] {
  --color-bg-base: white;
  --color-bg-editor: #f3f5f7;
}

html[data-theme="dark"] {
  --color-bg-base: black;
  --color-bg-editor: #1a1a1a;
}

.editor {
  background-color: var(--color-bg-editor);
}
```

### New Approach (Current)
```scss
// Centralized in variables.scss
@layer base {
  :root, [data-theme="light"] {
    --editor-bg: 0 0% 95.3%;
  }
  
  [data-theme="dark"], .dark {
    --editor-bg: 0 0% 10.2%;
  }
}

// Usage
.editor {
  background-color: hsl(var(--editor-bg));
}
```

## Best Practices

### 1. Variable Usage
✅ **DO**: Use semantic variable names
```scss
background-color: hsl(var(--editor-bg));
```

❌ **DON'T**: Use hard-coded colors
```scss
background-color: #f3f5f7;
```

### 2. Component Styles
✅ **DO**: Scope component styles
```scss
.my-component {
  &__header { }
  &__content { }
}
```

❌ **DON'T**: Use global utility classes in SCSS
```scss
.w-3 { width: 0.7rem; }  // Bad: conflicts with Tailwind
```

### 3. Dark Mode
✅ **DO**: Use CSS variables that adapt to theme
```scss
color: hsl(var(--foreground));
```

❌ **DON'T**: Define separate dark mode rules everywhere
```scss
color: black;
.dark & { color: white; }
```

### 4. Tailwind Integration
✅ **DO**: Use Tailwind for utility-first styling
```tsx
<div className="flex items-center gap-2 p-4">
```

✅ **DO**: Use SCSS for complex component styles
```scss
.complex-component {
  // Complex nested styles
}
```

❌ **DON'T**: Recreate Tailwind utilities in SCSS
```scss
.flex { display: flex; }  // Bad: Tailwind already provides this
```

## Runtime Style Injection

Styles are injected at runtime for library compatibility:

```typescript
// src/styles.tsx
export function ensureZenmarkStylesInjected() {
  if (typeof document === "undefined") return;
  if (document.getElementById(ZENMARK_STYLE_ID)) return;
  
  const css = getZenmarkCss();
  const style = document.createElement("style");
  style.id = ZENMARK_STYLE_ID;
  style.textContent = css;
  document.head.appendChild(style);
}
```

**Style Bundle Generation:**

```typescript
// src/styles/bundle.ts
import allStyles from "../css/index.scss?inline";

export const getZenmarkCss = (): string => allStyles;
```

The new approach:
- **Simplified**: Single import instead of multiple concatenations
- **Organized**: Hierarchical SCSS imports handle ordering
- **Efficient**: SCSS compiler optimizes the bundle
- **Maintainable**: Add new styles by updating partials, not bundle.ts

This ensures:
- No duplicate style injection
- Works across ESM/CJS/UMD formats
- Styles are always available when needed
- Proper CSS cascade and specificity

## Troubleshooting

### Styles Not Applying
1. Check if variables are defined in `variables.scss`
2. Ensure `global.scss` is imported first in `bundle.ts`
3. Verify Tailwind config includes the correct content paths

### Dark Mode Not Working
1. Ensure both `.dark` class and `[data-theme="dark"]` are supported in config
2. Check if variables are defined for dark mode
3. Verify the dark mode trigger mechanism is working

### Style Conflicts
1. Use scoped class names for components
2. Avoid recreating Tailwind utilities in SCSS
3. Use CSS variables for dynamic values

## Adding New Styles

### Adding a New Component Style

1. Create the component style file in the appropriate directory:
```scss
// src/css/components/my-component.scss
.my-component {
  background-color: hsl(var(--editor-bg));
  
  &__header {
    color: hsl(var(--editor-text));
  }
}
```

2. Add import to the component index:
```scss
// src/css/components/_index.scss
@import './force-title.scss';
@import './my-component.scss';  // Add here
```

3. Rebuild - the new styles are automatically included!

### Adding a New Utility Style

1. Create utility file:
```scss
// src/css/utilities/my-utility.scss
.my-utility {
  // Utility styles
}
```

2. Add import to utilities index:
```scss
// src/css/utilities/_index.scss
@import './focus.scss';
@import './my-utility.scss';  // Add here
```

### Adding a New Theme

1. Create theme file:
```scss
// src/css/themes/my-theme.scss
.editor {
  &.my-theme {
    // Theme-specific overrides
  }
}
```

2. Add import to themes index:
```scss
// src/css/themes/_index.scss
@import './basic.scss';
@import './my-theme.scss';  // Add here
```

## Future Improvements

- [x] Unified theme variable system
- [x] Optimized style file organization
- [x] Hierarchical SCSS imports
- [x] Comprehensive documentation
- [ ] Migrate from `@import` to `@use` (Sass modern syntax)
- [ ] Consider CSS Modules for stronger isolation
- [ ] Add design tokens documentation
- [ ] Create automated theme testing
- [ ] Add performance monitoring for style injection

---

Last Updated: November 2024

