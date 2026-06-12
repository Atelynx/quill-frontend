# Admin API Changelog — Frontend Integration Guide

## Phase 1: User Role System

### JWT Payload — `role` field added

The login response now includes `role` inside the JWT token. Decode the `accessToken` to get the user's role.

**Login response** (`POST /api/auth/login`):
```json
{
  "accessToken": "eyJ...",
  "user": {
    "id": "...",
    "fullName": "...",
    "email": "...",
    "role": "investor",          // ← NEW
    "username": "...",
    "availableBalance": 100000,
    "reservedBalance": 0,
    "watchlist": []
  }
}
```

**Possible values:** `"investor"` | `"admin"`

**Register response** (`POST /api/auth/register`) — unchanged, still returns `{ message, email, username }`.

### Profile endpoint — `role` field added

**GET /api/users/me** response now includes `role`:
```json
{
  "id": "...",
  "fullName": "...",
  "email": "...",
  "role": "investor",           // ← NEW
  "username": "...",
  "availableBalance": 100000,
  "reservedBalance": 0,
  "watchlist": []
}
```

### Frontend action items (Phase 1)
1. Decode JWT payload to extract `role` — store in auth state
2. Use `role` to conditionally show/hide admin UI elements
3. Profile display can show role badge if needed
4. All existing user flows remain unchanged for `"investor"` role

---

## Phase 2: Admin Config Module

All admin endpoints are under `/api/admin/config` and require:
- `Authorization: Bearer <token>` header
- User role must be `"admin"`

### 2a. List all active configs

**`GET /api/admin/config`**

Response: Array of active config documents.

**Example:**
```json
[
  {
    "_id": "...",
    "key": "COMMISSION_RATE",
    "value": 0.005,
    "name": "Comisión de trading",
    "tags": ["trading", "fees"],
    "inUse": true,
    "lastUsedAt": "2026-06-11T12:00:00.000Z",
    "updatedBy": null,
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

### 2b. Get single config

**`GET /api/admin/config/:key`**

Restart-required configs (`MARKET_PROVIDER`, `SIMULATION_STRATEGY`) include extra fields:

**Example (hot-swappable):**
```json
{
  "key": "COMMISSION_RATE",
  "value": 0.005,
  "name": "Comisión de trading",
  "tags": ["trading", "fees"],
  "inUse": true,
  "lastUsedAt": "2026-06-11T12:00:00.000Z",
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Example (restart-required):**
```json
{
  "key": "MARKET_PROVIDER",
  "value": "eodhd",
  "effectiveValue": "mock",        // ← NEW: what the app is currently using
  "appliesOn": "restart",           // ← NEW: tells frontend to show restart warning
  "name": "Proveedor de datos de mercado",
  "tags": ["market", "provider"],
  "inUse": true,
  "lastUsedAt": null,
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Error:** `404` if key doesn't exist.

### 2c. Get config history

**`GET /api/admin/config/:key/history`**

Returns Array of all versions (newest first). Each element is the same shape as the single config response.

### 2d. Create a new config

**`POST /api/admin/config`**

Body:
```json
{
  "key": "NEW_FEATURE_TOGGLE",
  "value": true,
  "name": "Nueva funcionalidad",       // optional
  "tags": ["features"]                  // optional
}
```

Response: The created config document.

**Auto-snapshot:** Creates a new snapshot of all active configs with name `"Auto · NEW_FEATURE_TOGGLE → true"`.

### 2e. Update a config

**`PUT /api/admin/config/:key`**

Body:
```json
{
  "value": 0.003,
  "name": "Comisión reducida 0.3%",    // optional
  "tags": ["trading", "fees", "promo"]  // optional
}
```

**Behavior:** Creates a NEW version of the config with `inUse: true`. The previous version is set to `inUse: false` (backup preserved in history).

**Error:** `404` if key doesn't exist.

**Auto-snapshot:** Creates a new snapshot of all active configs.

### 2f. Delete a config

**`DELETE /api/admin/config/:key`**

Response:
```json
{
  "message": "Configuración \"COMMISSION_RATE\" eliminada."
}
```

**Error:** `404` if key doesn't exist.

**Note:** Hard deletes ALL versions of the key from both `admin_configs` and its related history.

### 2g. List snapshots

**`GET /api/admin/config/snapshots`**

Response: Array of snapshots (newest first).

```json
[
  {
    "_id": "...",
    "configs": {
      "COMMISSION_RATE": 0.005,
      "INITIAL_BALANCE": 100000,
      "MARKET_HOURS_OPEN": "09:30",
      "MARKET_HOURS_CLOSED": "16:00",
      "MARKET_PROVIDER": "mock",
      "SIMULATION_STRATEGY": "flat"
    },
    "name": "Auto · COMMISSION_RATE → 0.003",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

### 2h. Get single snapshot

**`GET /api/admin/config/snapshots/:id`**

Response: Single snapshot document (same shape as above, without array wrapper).

### 2i. Create manual snapshot

**`POST /api/admin/config/snapshots`**

Body:
```json
{
  "name": "Pre-producción Junio 2026"    // optional, auto-generated if omitted
}
```

Response: The created snapshot document.

### 2j. Restore snapshot

**`POST /api/admin/config/snapshots/:id/restore`**

Restores ALL configs to the values captured in the snapshot. Creates an audit snapshot named `"Restore · [snapshot name]"`.

Response: The audit snapshot document.

### Frontend action items (Phase 2)

1. **Admin Layout:**
   - Create admin panel accessible only when `user.role === "admin"`
   - Navigate to `/admin/config` to manage settings

2. **Config list page (GET /admin/config):**
   - Display all configs in a table/card layout
   - Show `name`, `key`, `value`, `lastUsedAt`, `tags`
   - Visual indicator for restart-required configs (`appliesOn: "restart"`)
   - "Edit" button per row → opens edit modal

3. **Config edit modal (PUT /admin/config/:key):**
   - Form with `value` input (type varies: number, string, boolean)
   - Optional `name` and `tags` fields
   - On save: show success/error toast
   - For restart-required configs: show warning "Requiere reinicio del servidor"
   - Show "effectiveValue" vs "value" for restart-required keys

4. **Config create form (POST /admin/config):**
   - Form with `key`, `value`, optional `name`, `tags`
   - Only for power-user admins who want to add new config keys

5. **Config history (GET /admin/config/:key/history):**
   - "View history" button per config
   - Shows all versions with timestamps and value changes
   - Could show diff between versions

6. **Config delete (DELETE /admin/config/:key):**
   - "Delete" button per config with confirmation dialog
   - Warning: this completely removes the key and its history

7. **Snapshots panel (GET /admin/config/snapshots):**
   - List all snapshots with timestamp and name
   - "Create snapshot" button → optional name field
   - "Restore" button per snapshot → confirmation dialog with warning
   - "View details" to see all config values at that point in time

8. **Navigation:**
   - Main sections: "Configuraciones" and "Snapshots" (or "Respaldos")

---

## Phase 3: Modified Service Behavior (No API Changes)

### 3a. Commission rate now reads from admin config

No endpoint changes. `COMMISSION_RATE` is read at order execution time:

1. Check AdminConfig for `COMMISSION_RATE` key
2. If found → use that value
3. If not found → fall back to env var `COMMISSION_RATE` (default `0.005`)

**No frontend changes needed.** The frontend displays commission info as before.

### 3b. Initial balance now reads from admin config

No endpoint changes. `INITIAL_BALANCE` is read at user registration:

1. Check AdminConfig for `INITIAL_BALANCE` key
2. If found → use that value for new users
3. If not found → fall back to env var `INITIAL_BALANCE` (default `100000`)

**No frontend changes needed.** Registration flow is unchanged.

### 3c. Market hours — Market Order rejection

**`POST /api/orders`** with `type: "MARKET"` during closed hours returns:

```json
{
  "statusCode": 400,
  "path": "/api/orders",
  "timestamp": "2026-06-11T15:30:00.000Z",
  "message": "El mercado está cerrado. Las órdenes MARKET solo se ejecutan en horario de mercado.",
  "error": "Bad Request"
}
```

**Frontend action items (Phase 3c):**
1. Handle `400` error in market order form — display the market hours error message to the user
2. Optionally, before allowing a market order, call `GET /api/admin/config/MARKET_HOURS_OPEN` and `GET /api/admin/config/MARKET_HOURS_CLOSED` to check if market is open (but checking on error is simpler)
3. Limit orders (`type: "LIMIT"`) are NOT affected — they can be submitted 24/7

### 3d. Market hours — LIMIT order silent skip

No error returned. Pending LIMIT orders simply aren't evaluated while the market is closed. This is a backend-side behavior change with no frontend visibility.

### Frontend action items (Phase 3 — summary)

| Item | Priority | Description |
|---|---|---|
| Handle 400 error on MARKET orders | High | Show "Mercado cerrado" message |
| Display role-based UI | High | Show/hide admin panel based on `role` |
| Admin panel UI | High | Config list, edit, history, snapshots |
| Restart warning on config edit | Medium | Show "Requiere reinicio" for MARKET_PROVIDER / SIMULATION_STRATEGY |
| Config value types | Medium | Render appropriate input (number for COMMISSION_RATE, string for MARKET_HOURS_OPEN, etc.) |

---

## Config Keys Reference

| Key | Type | Description | Editable | Applies On |
|---|---|---|---|---|
| `COMMISSION_RATE` | `number` (0–1) | Trading commission rate | ✅ | Next order |
| `INITIAL_BALANCE` | `number` (positive) | Starting balance for new users | ✅ | Next registration |
| `MARKET_HOURS_OPEN` | `string` ("HH:MM") | Market opening time (24h) | ✅ | Next check |
| `MARKET_HOURS_CLOSED` | `string` ("HH:MM") | Market closing time (24h) | ✅ | Next check |
| `MARKET_PROVIDER` | `string` ("mock"\|"eodhd") | Market data source | ✅ | Restart |
| `SIMULATION_STRATEGY` | `string` ("flat"\|"gbm"\|"nw") | Price simulation algorithm | ✅ | Restart |

All configs have `name`, `tags`, `lastUsedAt`, and full version history automatically.
