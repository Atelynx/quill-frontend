# Plan — Mobile Responsive Styles

---

## Goal
Add responsive mobile styles across the app, with the primary fix being a hamburger drawer sidebar on mobile.

---

## Step 1 — AppShell: Hamburger Drawer Sidebar

**File:** `src/shared/layout/AppShell.tsx`

- Add `useState` for `sidebarOpen`
- Add `useEffect` with Escape key + body scroll lock
- **Hamburger button** (`max-[720px]:flex hidden`): fixed top-left, toggles drawer
- **Backdrop overlay** (`max-[720px]:block hidden`): fixed fullscreen, closes on click
- **`<aside>` sidebar**: on mobile (`max-[720px]`) becomes `fixed inset-y-0 left-0 z-50 w-[280px]` with `translate-x` slide transition; add close button inside
- On desktop (>720px) the sidebar stays in the CSS grid as before

No new dependencies — pure React state + Tailwind transitions.

---

## Step 2 — SectionCard: Mobile Padding

**File:** `src/shared/components/SectionCard.tsx`
- Add `max-[720px]:p-4` (from `p-5`)
- Add `max-[720px]:flex-col` to header `flex` container

---

## Step 3 — MarketChart: Responsive Height

**File:** `src/app/dashboard/components/MarketChart.tsx`
- Add `max-[720px]:h-[220px]` to chart container class (from `h-[300px]`)

---

## Step 4 — OrderForm: Stack Buy-Mode Toggle

**File:** `src/app/orders/components/OrderForm.tsx`
- Add `max-[720px]:flex-col` to `buyModeToggle` div

---

## Step 5 — FriendsPage: Stack Search Input

**File:** `src/app/friends/pages/FriendsPage.tsx`
- Add `max-[720px]:flex-col` to the search input + button flex container

---

## Pattern compliance (rules.md)

| Rule | Compliance |
|---|---|
| §1 — <400 lines/component | AppShell stays under limit (116 → ~170 lines) |
| §2 — Reuse design system | Uses existing gradient, surface, button design tokens |
| §3 — Props & state | Local component state for drawer; no prop drilling |
| §4 — State management | Local `useState` for sidebar; does not belong in Redux |

## Files touched

| File | Action |
|---|---|
| `src/shared/layout/AppShell.tsx` | Add hamburger drawer |
| `src/shared/components/SectionCard.tsx` | Add responsive padding |
| `src/app/dashboard/components/MarketChart.tsx` | Add responsive height |
| `src/app/orders/components/OrderForm.tsx` | Stack toggle buttons |
| `src/app/friends/pages/FriendsPage.tsx` | Stack search input |
