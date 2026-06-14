# Frontend Plan: Admin Config Update Flow Fix

## Problem

When a user edits an admin config value, the change appears not to apply:
- For restart-required keys (`MARKET_PROVIDER`, `SIMULATION_STRATEGY`), the table shows the env var value (`effectiveValue`) instead of the newly saved DB value
- `CURRENCY_PROVIDER` never shows a restart warning because it's missing from the restart-required set (backend fix, but frontend must handle it once added)
- No success/error feedback after save, create, or delete mutations
- Value type coercion via `isNaN(Number(value))` silently converts numeric strings to numbers

---

## Changes

### 1. New file: `shared/components/Toast.tsx`

Create a lightweight toast notification system (no external dependencies).

**Location:** `quill-frontend/src/shared/components/Toast.tsx`

**Approach:**
- A module-level `showToastFn` that components call via a named export `showToast(message, type)`
- A `ToastContainer` component that renders a fixed-position toast at bottom-right
- Auto-dismiss after 3 seconds
- Two variants: `'success'` (green) and `'error'` (red)

**Integration:** Mount `<ToastContainer />` once in `AppProviders.tsx` so it's available app-wide.

**Files:**
- `src/shared/components/Toast.tsx` — new
- `src/app/providers/AppProviders.tsx` — add `<ToastContainer />`

---

### 2. `AdminConfigPage.tsx` — Fix value display for restart-required keys

**Location:** `quill-frontend/src/app/admin/pages/AdminConfigPage.tsx`, value cell (~lines 67-74)

**Current behavior:**
```tsx
{cfg.appliesOn === 'restart' ? (
  <span title={`Valor efectivo: ${String(cfg.effectiveValue)}`}>
    {String(cfg.effectiveValue ?? cfg.value)}
  </span>
) : (
  String(cfg.value)
)}
```

Shows `effectiveValue` (env var) as the main text — the user's DB change is hidden in a tooltip.

**New behavior:**
- Always show `cfg.value` (the DB value) as the primary text
- For restart-required keys where `effectiveValue` differs from `value`, show `effectiveValue` as secondary muted text
- When `effectiveValue` matches `value` (env var unset), no extra display

```tsx
<span>{String(cfg.value)}</span>
{cfg.appliesOn === 'restart' && cfg.effectiveValue !== undefined &&
 String(cfg.value) !== String(cfg.effectiveValue) ? (
  <span className="ml-2 text-[0.75rem] text-[var(--main-page-text-muted)]">
    ({admin.config.fields.effectiveValue}: {String(cfg.effectiveValue)})
  </span>
) : null}
```

**Example display after fix:** `eodhd (Valor efectivo: mock)`

---

### 3. `mutations.ts` — Add toast notifications

**Location:** `quill-frontend/src/shared/api/hooks/mutations.ts`

**Changes to 4 admin mutation hooks:**

| Mutation | Toast message on success |
|----------|--------------------------|
| `useCreateAdminConfig` | `'Configuración creada correctamente.'` |
| `useUpdateAdminConfig` | `'Configuración actualizada correctamente.'` |
| `useDeleteAdminConfig` | `'Configuración eliminada correctamente.'` |
| `useRestoreSnapshot` | `'Respaldo restaurado correctamente.'` |

Import and call `showToast` from `../../components/Toast` in each `onSuccess` handler.

---

### 4. `ConfigEditModal.tsx` — Fix value type coercion

**Location:** `quill-frontend/src/app/admin/components/ConfigEditModal.tsx`, line 34

**Current:**
```ts
value: isNaN(Number(value)) ? value : Number(value),
```

**Problem:** `Number("eodhd")` → `NaN` → `isNaN(NaN)` → `true` → stays string (ok). But `Number("100000")` → `100000` → coerces numeric strings even when the backend expects a string. Also `isNaN` has edge cases with empty strings and whitespace.

**New:**
```ts
value: typeof config.value === 'number' && /^-?\d+(\.\d+)?$/.test(value)
  ? Number(value)
  : value,
```

Only coerce to number if:
- The original config value was a number (preserve type)
- AND the text matches a pure numeric pattern

Otherwise keep as string.

---

### 5. `ConfigCreateForm.tsx` — Fix value coercion + add restart warning

**Location:** `quill-frontend/src/app/admin/components/ConfigCreateForm.tsx`

**A. Value coercion (line 32):**
```ts
value: /^-?\d+(\.\d+)?$/.test(value) ? Number(value) : value,
```

No `typeof` guard here since there's no existing `config` to reference; only coerce pure numeric strings.

**B. Dynamic restart warning:**
Add a check after the form title — if the typed key matches a known restart-required key, show the amber warning box:

```tsx
const RESTART_KEYS = new Set(['MARKET_PROVIDER', 'SIMULATION_STRATEGY', 'CURRENCY_PROVIDER']);
const isRestartKey = RESTART_KEYS.has(key);
```

Render conditionally above the form fields:
```tsx
{isRestartKey ? (
  <p className="mb-4 rounded-[var(--main-page-radius-md)] border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-600">
    ⚠ {admin.config.restartWarning}
  </p>
) : null}
```

---

### 6. `strings.ts` — Add toast message strings (optional)

If desired, add the toast message strings to the admin section of `strings.ts` for consistency and i18n readiness.

---

## Files Summary

| # | File | Action |
|---|------|--------|
| 1 | `src/shared/components/Toast.tsx` | **New** — toast component + imperative API |
| 2 | `src/app/providers/AppProviders.tsx` | Edit — add `<ToastContainer />` |
| 3 | `src/app/admin/pages/AdminConfigPage.tsx` | Edit — value cell rendering |
| 4 | `src/shared/api/hooks/mutations.ts` | Edit — add `showToast` calls |
| 5 | `src/app/admin/components/ConfigEditModal.tsx` | Edit — fix type coercion |
| 6 | `src/app/admin/components/ConfigCreateForm.tsx` | Edit — fix coercion + add restart warning |

---

## Verification

1. Open `/admin/config` page
2. Verify `CURRENCY_PROVIDER` row exists with amber "Requiere reinicio del servidor" badge
3. Edit `MARKET_PROVIDER` from `mock` to `eodhd` → save → green toast appears → table shows `eodhd (Valor efectivo: mock)`
4. Edit `COMMISSION_RATE` → save → toast appears → value updates immediately in table
5. Click "Nueva configuración" → type `MARKET_PROVIDER` → amber restart warning appears
6. Delete a config → toast confirms deletion
