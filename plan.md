# Quill Frontend Plan

---

## Feature: MARKET Orders (Instant Execution)

**Branch:** `feat/instant-order-front`
**Backend:** `feat/instant-order` — `POST /api/orders` now accepts optional `type: 'LIMIT' | 'MARKET'` (default `'LIMIT'`). MARKET orders execute instantly at the live price from Redis; `limitPrice` is optional.

### Steps

1. **`validators/orders.ts`** — Extend both schemas:
   - `OrderRecordSchema`: add `type: z.enum(['LIMIT', 'MARKET']).default('LIMIT')`, make `limitPrice` optional
   - `CreateOrderInputSchema`: add `type: z.enum(['LIMIT', 'MARKET']).default('LIMIT')`, make `limitPrice` optional

2. **`types.ts`** — Update `OrderRecord` interface: add `type: 'LIMIT' | 'MARKET'`, make `limitPrice` optional

3. **`OrderForm.tsx`** — Add LIMIT/MARKET toggle:
   - When MARKET is selected: hide limitPrice input, show "Se ejecutara al precio actual de mercado"
   - When LIMIT is selected: current behavior unchanged
   - Update feedback message and help text per type

4. **`OrdersTable.tsx`** — Add "Tipo" column with badge (Mercado / Limite), show `—` for MARKET limitPrice

### Commit
`feat: add MARKET order type selector and instant execution UI`

---

# Refactor Plan — Quill Frontend

## Goal
Clean up project structure, remove dead code, consolidate components, eliminate duplicate theme system, and create a centralized design tokens file — with **zero impact on build or visualization**.

---

## Phase 1: Component Structure Cleanup

**Principle:** All reusable UI lives in one flat `src/shared/components/` folder. Atomic design subdirectories removed. Empty stubs deleted.

### Steps
1. **Delete 12 empty stub files** (0 lines of code):
   - `src/components/atoms/Icon.tsx`
   - `src/components/atoms/Label.tsx`
   - `src/components/molecules/Card/Card.tsx`
   - `src/components/molecules/FormField/FormField.tsx`
   - `src/components/molecules/FormField/index.ts`
   - `src/components/molecules/SearchBar/index.ts`
   - `src/components/molecules/Toast.tsx`
   - `src/components/organisms/Header.tsx`
   - `src/components/organisms/Sidebar.tsx`
   - `src/components/organisms/StockTable.tsx`
   - `src/components/templates/AuthLayout.tsx`
   - `src/components/templates/DashboardLayout.tsx`

2. **Move real components** to `src/shared/components/`:
   - `Button.tsx` (from `atoms/`)
   - `Input.tsx` (from `atoms/`)

3. **Fix import paths**:
   - `TestPage.tsx`: `@/components/atoms/Button` → `@/shared/components/Button`

4. **Rename & move** `src/components/Links.component.tsx` → `src/shared/components/PagesBar.tsx` (export is already `PagesBar`):
   - Fix imports in `Home.tsx` and `TestPage.tsx`

5. **Delete** the now-empty `src/components/` directory tree

6. **Delete leftover Vite boilerplate** (unused — verified by grep):
   - `src/App.css`
   - `src/assets/react.svg`

7. **Delete** unused `src/components/molecules/SearchBar/SearchBar.tsx` (imported by nothing)

8. **Add** barrel export `src/shared/components/index.ts`

---

## Phase 2: Design System Tokens

**Principle:** A single TypeScript source of truth for design tokens.

### Steps
1. **Create** `src/shared/design-system/tokens.ts`:
   - Export typed constants for radii, shadows, transitions, spacing
   - Extract values from the `--main-page-*` CSS variables in `main-page-primitives.css`
2. (Optionally) Convert `tailwind.config.cjs` to import from tokens

---

## Phase 3: Fix Duplicated Theme System

**Problem:** `use-theme.tsx` (React context) competes with Redux `themeSlice`. No CSS depends on `[data-theme]` (verified by grep). `MarketChart.tsx` imports `useTheme()` but never uses the returned value.

### Steps
1. **Remove** unused `useTheme()` import from `MarketChart.tsx` (unused variable)
2. **Remove** `ThemeProvider` from `AppProviders.tsx`
3. **Remove** `ThemeProvider` from `test/render.tsx`
4. **Add** `document.documentElement.style.colorScheme = mode` to `themeSlice.ts` (preserves dark scrollbars)
5. **Delete** `shared/theme/use-theme.tsx` and `use-theme.spec.tsx`
6. **Delete** `shared/theme/` directory

---

## Phase 4: Fix Code Quality

1. **Fix** `NotFound.tsx` — replace hardcoded Tailwind colors (`bg-teal-600`, `text-slate-800`, `dark:` classes) with theme-aware equivalents
2. **Move** pages into feature subdirectories:
   - `Home.tsx` → `app/home/Home.tsx`
   - `TestPage.tsx` → `app/test/TestPage.tsx`
   - `NotFound.tsx` → `app/not-found/NotFound.tsx`
3. **Update** lazy imports in `AppRouter.tsx`

---

## Commit Strategy

Each phase is committed separately with descriptive messages:

1. `refactor: remove 12 empty stub files from atomic design scaffolding`
2. `refactor: consolidate Button and Input into shared/components/`
3. `refactor: rename Links.component.tsx to PagesBar.tsx and move to shared/components/`
4. `refactor: remove unused App.css, react.svg, and SearchBar component`
5. `refactor: add barrel export for shared/components/`
6. `refactor: create centralised design system tokens`
7. `refactor: remove duplicate ThemeProvider, keep Redux as sole theme system`
8. `refactor: fix NotFound.tsx theme colors and organise page files into feature folders`
