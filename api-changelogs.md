
## Branch: `feat/instant-order`

### New Feature: MARKET Orders (Instant Execution)

- Added `type: 'LIMIT' | 'MARKET'` field to Order schema (default `'LIMIT'` for backward compatibility).
- `POST /api/orders` now accepts an optional `type` field. When `type: 'MARKET'`:
  - `limitPrice` is ignored (sanitized to `undefined` before processing).
  - The order executes immediately at the current live price from Redis (`stock:<symbol>:live_price`).
  - No balance reservation step — checks `availableBalance` directly at execution time.
  - Created with `status: 'EXECUTED'` directly, skipping the cron-based execution cycle.
  - Returns with `executionPrice`, `commissionAmount`, and `executedAt` set.
- If no live price is available in Redis, the request fails with `404` — the user must use a LIMIT order instead.
- `OrderExecutionService.executeMarketOrder()` reads the live price from `CacheService` and runs the full transactional logic (balance debit/credit, position update, Trade creation) inside a MongoDB session.
- The cron cycle (`processPendingOrders`) naturally skips MARKET orders since they're never `PENDING`.
- `limitPrice` is now optional in the DTO (`@IsOptional()`) to allow MARKET orders without a price.
