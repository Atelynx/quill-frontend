import { z } from 'zod';

/**
 * Schema for a stock quote (market data)
 */
export const StockQuoteSchema = z.object({
  _id: z.string().optional(),
  symbol: z.string(),
  name: z.string(),
  currency: z.string(),
  close: z.number(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  previousClose: z.number(),
  dayChangePercentage: z.number(),
  source: z.string(),
  volume: z.number(),
  lastMarketDate: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  sector: z.string().optional(),
});

export type StockQuote = z.infer<typeof StockQuoteSchema>;

/**
 * Schema for a price point in historical price data
 */
export const PricePointSchema = z.object({
  symbol: z.string(),
  price: z.number(),
  createdAt: z.string().datetime(),
});

export type PricePoint = z.infer<typeof PricePointSchema>;
