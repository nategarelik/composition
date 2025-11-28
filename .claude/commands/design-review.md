---
description: Review UI components against the Clinical Lab Terminal design system
allowed-tools: Read, Grep, Glob
---

# Design System Review

Review UI components to ensure they follow the Clinical Lab Terminal design system.

## Files to Review
!`find src/components -name "*.tsx" -type f | head -20`

## Design Checklist

### Color System
- [ ] Using CSS variables, not hardcoded hex values
- [ ] Correct semantic colors (accent-primary for actions, accent-secondary for success)
- [ ] Proper contrast ratios for accessibility

### Typography
- [ ] `font-sans` (Inter) for UI text
- [ ] `font-mono` (JetBrains Mono) for data, code, terminal elements
- [ ] Appropriate font sizes (text-xs for labels, text-sm for body)

### Spacing & Layout
- [ ] Consistent padding (p-2, p-3, p-4)
- [ ] Panel structure (header + content pattern)
- [ ] Border styling (border-subtle for panels)

### Terminal Aesthetic
- [ ] Monospace elements for data readouts
- [ ] Status indicators with pulse animations
- [ ] Command-line inspired inputs (> _ cursor)
- [ ] Uppercase labels with tracking-wider

### 3D Software Patterns
- [ ] Menu bar structure (FILE, EDIT, VIEW, etc.)
- [ ] Tool palette on left side
- [ ] Properties panel on right side
- [ ] Keyboard shortcut hints

## Instructions

1. Scan all components in `src/components/`
2. Check each against the design checklist
3. Report violations with specific file:line references
4. Suggest fixes for each violation
5. Rate overall design system compliance (0-100%)
