# Mobile & PC View Management Skill

This skill defines the visual constraints and behavioral logic for rendering the Portfolio across different viewports.

## Core Dimensions
Based on @[measures.txt](file:///home/iangrosan/Desktop/Proyectos/git/Portafolio/.agents/measures.txt):
- **PC Display**: 1440px × 900px
- **Mobile Display**: 375px × 667px

## 1. Defining the Difference

### PC View (Canvas Architecture)
- **Primary Orientation**: Landscape.
- **Interaction**: Precise cursor (hover states are critical).
- **Density**: High. Multiple columns, sidebars, and nested menus are encouraged.
- **Containment**: Content usually lives within a "Main Container" (e.g., max-width: 1200px) centered on the screen.

### Mobile View (Stack Architecture)
- **Primary Orientation**: Portrait.
- **Interaction**: Touch (no hover, large hit targets ~44px minimum).
- **Density**: Low/Focused. Single-column vertical stack.
- **Containment**: Full-bleed width (0px margins on narrowest points) to maximize screen real estate.

---

## 2. Layout Logic: Fit vs. Overflow

### When to "Fit to Page" (width: 100% / max-width: 100vw)
- **Critical Rule**: Horizontal overflow is a **FAILURE**. Nothing should ever cause a horizontal scrollbar on either PC or Mobile.
- **PC**: Use `overflow: hidden` on the `body` or `wrapper` if dynamic animations (like smoke/glow) leak outside the viewport.
- **Mobile**: All text, images, and cards MUST fit within the 375px width.

### When to "Overflow"
- **Vertical**: Always for long-form content. Use `smooth` scrolling behaviors.
- **Horizontal (Internal)**: Only for specific components like:
  - Code snippets (`pre` / `code` blocks).
  - Data tables that cannot be collapsed.
  - Carousel sliders.
- **PC Special Case**: If a modal is larger than 900px height, the modal itself should overflow, not the background page.

---

## 3. Implementation Benchmarks

| Feature | PC (1440px) | Mobile (375px) |
| :--- | :--- | :--- |
| **Navbar** | Persistent horizontal menu | Hamburger/Hidden menu |
| **Grid** | 3 - 4 Columns | 1 Column (Stack) |
| **Font Size** | 16px - 18px Base | 14px - 16px Base |
| **Images** | Fixed aspect ratios | Fluid width (100%) |
| **Glow/Effects** | Mouse-tracking (dynamic) | Static or accelerometer-based |

## 4. Constraint Enforcement
Check every UI change against these two views:
1. **PC Check**: Does it feel empty? (Add margins/padding if so).
2. **Mobile Check**: Is it cramped? (Reduce font size or increase vertical padding).
3. **Critical**: Ensure `meta viewport` is set to `width=device-width, initial-scale=1.0`.
