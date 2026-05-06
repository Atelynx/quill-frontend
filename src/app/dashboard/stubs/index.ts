import type {
  StockQuote,
  PortfolioSummary,
  OrderRecord,
  TradeRecord,
  PricePoint,
} from '../../../shared/api/validators';

export const STUB_QUOTES: StockQuote[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    currency: 'USD',
    currentPrice: 193.12,
    previousClose: 190.42,
    dayChangePercentage: 1.42,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    sector: 'Technology',
    currency: 'USD',
    currentPrice: 421.64,
    previousClose: 425.11,
    dayChangePercentage: -0.82,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    sector: 'Automotive',
    currency: 'USD',
    currentPrice: 176.33,
    previousClose: 171.2,
    dayChangePercentage: 3,
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    sector: 'Consumer Discretionary',
    currency: 'USD',
    currentPrice: 182.44,
    previousClose: 183.18,
    dayChangePercentage: -0.4,
  },
];

export const STUB_PORTFOLIO: PortfolioSummary = {
  availableBalance: 10_000,
  reservedBalance: 1_000,
  investedValue: 43_600,
  totalEquity: 54_600,
  unrealizedProfitLoss: 2000,
  positions: [
    {
      symbol: 'AAPL',
      quantity: 120,
      reservedQuantity: 0,
      averageCost: 182.5,
      marketPrice: 193.12,
      marketValue: 23_174.4,
      unrealizedProfitLoss: 1_274.4,
    },
    {
      symbol: 'MSFT',
      quantity: 40,
      reservedQuantity: 0,
      averageCost: 410,
      marketPrice: 421.64,
      marketValue: 16_865.6,
      unrealizedProfitLoss: 465.6,
    },
    {
      symbol: 'TSLA',
      quantity: 75,
      reservedQuantity: 10,
      averageCost: 168,
      marketPrice: 176.33,
      marketValue: 13_224.75,
      unrealizedProfitLoss: 624.75,
    },
  ],
};

export const STUB_ORDERS: OrderRecord[] = [
  {
    _id: 'order-1',
    symbol: 'AAPL',
    side: 'BUY',
    quantity: 20,
    limitPrice: 191,
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
  {
    _id: 'order-2',
    symbol: 'TSLA',
    side: 'SELL',
    quantity: 10,
    limitPrice: 179,
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
];

export const STUB_TRADES: TradeRecord[] = [
  {
    _id: 'trade-1',
    symbol: 'MSFT',
    side: 'BUY',
    quantity: 10,
    executionPrice: 420.25,
    grossAmount: 4202.5,
    commissionAmount: 6.5,
    netAmount: 4209,
    executedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    _id: 'trade-2',
    symbol: 'AAPL',
    side: 'SELL',
    quantity: 5,
    executionPrice: 194.2,
    grossAmount: 971,
    commissionAmount: 2.2,
    netAmount: 968.8,
    executedAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
  },
];

export function buildStubHistory(symbol: string, limit = 24): PricePoint[] {
  const baseBySymbol: Record<string, number> = {
    AAPL: 193.12,
    MSFT: 421.64,
    TSLA: 176.33,
    AMZN: 182.44,
  };
  const base = baseBySymbol[symbol] ?? 100;

  return Array.from({ length: limit }, (_, index) => {
    const minuteOffset = limit - index;
    const swing = Math.sin(index / 3) * (base * 0.008);

    return {
      symbol,
      price: Number((base + swing).toFixed(2)),
      createdAt: new Date(Date.now() - minuteOffset * 60_000).toISOString(),
    } as PricePoint;
  });
}
