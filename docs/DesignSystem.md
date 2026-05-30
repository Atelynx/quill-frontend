# Quill Design System

## Purpose

Quill should feel calm, trustworthy, and efficient. It is a finance-oriented product, so the system should prioritize clarity, consistency, and readable data over decoration. The visual language should stay modern and minimal, but with enough personality in color and depth to feel like a real product instead of a generic admin template.

## Design Principles

1. Clear over clever. Every surface, label, and interaction should reduce friction.
2. Balanced density. Tables and charts can stay compact, while forms and auth screens should breathe more.
3. Quiet components. Core UI pieces should be utility-first and not compete with content.
4. Theme-driven personality. Themes can change accent character and mood, but the base layout system stays stable.
5. Accessibility is part of the system. High contrast, large text, reduced motion, and readable typography are not optional extras.

## Information Architecture

The app should follow a page-owned template structure.

- `src/app/router/AppRouter.tsx` should stay focused on routing composition, not page layout definitions.
- Each page folder owns its page template and page-specific layout concerns.
- Shared atoms, molecules, and organisms live in `src/components`.
- Templates that are specific to a page or route family should live inside that page folder, not in the shared component tree.

Recommended structure:

- `src/components/atoms` for buttons, inputs, icons, labels, and other base primitives.
- `src/components/molecules` for composed controls like cards, form fields, search bars, and toast messages.
- `src/components/organisms` for larger reusable structures like headers, sidebars, and tables.
- `src/app/<page>/` for page-specific templates, page CSS, and page orchestration.

## Visual Direction

### Mood

- Calm and trustworthy.
- Modern minimal, but not sterile.
- Slightly expressive through accent color, spacing rhythm, and soft depth.

### Color Strategy

- Use a small set of semantic tokens rather than relying on raw hex values in components.
- Themes should define their own palette personality, especially accent and secondary tones.
- Base surfaces should remain neutral enough that multiple themes can coexist without changing component behavior.
- Charts and highlighted metrics can be more expressive than standard form controls.

### Surface Style

- Prefer soft depth over heavy material effects.
- Use borders, subtle shadows, and layered panels instead of strong elevation.
- Keep cards and containers readable in both light and dark modes.

## Typography

- Default to a system-safe sans-serif stack for reliability and speed.
- Headings should be clear and slightly stronger than body text, but not overly stylized.
- Numbers, tables, and market data should be easy to scan.
- Large text mode and the dyslexic font toggle must remain first-class accessibility behaviors.

## Theme System

Redux owns theme state.

- Theme selection should live in Redux.
- Applying the selected theme to the document root should remain the source of truth for CSS variables and data attributes.
- The current theme model already supports multiple light and dark themes, and the system should expand from that model rather than replace it.
- Future themes can add more color variety, but they should still map to the same semantic token set.

Suggested token categories:

- `background`
- `surface`
- `surface-alt`
- `primary`
- `secondary`
- `accent`
- `text`
- `muted-text`
- `border`
- `success`
- `warning`
- `danger`
- `info`

## Accessibility System

Redux also owns accessibility preferences.

- High contrast should be a supported theme mode or theme override.
- Reduced motion should disable non-essential animation and transition behavior.
- Large text mode should scale the interface without breaking layouts.
- Dyslexic font mode should remain available as a user preference.
- Keyboard focus states should always be visible and deliberate.

## Component Rules

### Atoms

- Buttons should support at least primary, secondary, and destructive intent.
- Inputs should have clear focus, error, and disabled states.
- Labels should remain readable and never depend on color alone.

### Molecules

- Cards should handle content grouping, headings, and optional action areas.
- Form fields should combine label, helper text, error text, and control alignment consistently.
- Toasts should communicate status without blocking the screen.

### Organisms

- Headers and sidebars should define navigation and page context.
- Tables should be optimized for scanning, filtering, and empty states.
- Dashboard summaries and charts should have a shared rhythm so the page feels coordinated.

## Page Patterns

### Auth Pages

- Auth screens should feel simpler and calmer than dashboard screens.
- They should use the same design language, but with less density and fewer competing visuals.
- Login flows should be driven by Redux-managed account state and theme preferences.

### Dashboard Pages

- Dashboard pages should feel data-rich, polished, and organized.
- Charts and tables can carry more visual emphasis here than in other areas.
- Page templates should own dashboard-specific layout composition.

### Form Pages

- Forms should favor clarity, spacing, and strong validation feedback.
- Error text should be specific and visible.
- Primary actions should be obvious and consistently placed.

## Motion

- Motion should support comprehension, not decoration.
- Keep animations subtle and purposeful.
- Respect reduced-motion settings everywhere.

## What This System Optimizes For

- Fast scanning of financial data.
- Predictable layouts across auth, dashboard, and form flows.
- A themeable interface that still feels like one product.
- Accessibility settings that are genuinely supported in the UI and in the DOM.

## Open Questions To Finalize Later

1. Whether some themes should be brand-led while others stay more neutral.
2. Whether dashboard charts should use a single chart style or page-specific variants.
3. How far the system should go with page-specific templates before shared abstractions become too broad.
4. Whether to formalize semantic tokens in CSS variables now or after the component library is stabilized.
