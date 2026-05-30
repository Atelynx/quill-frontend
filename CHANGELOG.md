# Changelog — Frontend

## Branches: `feat/currency-exchange`, `feat/currency-suffix-map`

### WebSocket API Changes

#### Subscribe/Unsubscribe now supports forex rooms

The `subscribe` and `unsubscribe` messages now accept an optional `type` field:

```ts
// Subscribe to stock (default — backward compatible)
ws.send(JSON.stringify({ event: 'subscribe', data: { topic: 'AAPL' } }));
ws.send(JSON.stringify({ event: 'subscribe', data: { topic: 'AAPL', type: 'stock' } }));

// Subscribe to forex
ws.send(JSON.stringify({ event: 'subscribe', data: { topic: 'USDCLP', type: 'forex' } }));
```

| `type` | Room joined | Events received |
|---|---|---|
| `'stock'` (default) | `stock:{topic}` | `price_update` for stocks |
| `'forex'` | `forex:{topic}` | `price_update` for forex pairs |

#### Price update event

The `price_update` event payload is unchanged:

```ts
{
  symbol: string;
  price: number;
  dayChangePercentage?: number;
  timestamp: string;  // ISO 8601
}
```

This event is now broadcast to both `stock:{symbol}` and `forex:{symbol}` rooms.

### New REST Endpoint: `GET /currency/rates`

Returns all tracked forex pairs with their latest live prices:

```json
[
  {
    "symbol": "USDCLP",
    "rate": 894.42,
    "basePrice": 894.10,
    "dayChangePercentage": -0.78
  }
]
```

You can also fetch a single rate: `GET /currency/rates/:symbol` (e.g., `GET /currency/rates/USDCLP`).

This is useful for displaying the CLP-to-USD conversion rate in the UI, complementing the WebSocket stream for real-time updates.

### Currency Field

The `currency` field returned in stock/forex data is now dynamically resolved from the symbol suffix via the new `CURRENCY_SUFFIX_MAP` environment variable on the backend (e.g., `.SN=CLP, .US=USD`). Previously it was hardcoded per provider — this means the frontend can expect correct per-symbol currency values (especially important when mixing stocks from different exchanges).
