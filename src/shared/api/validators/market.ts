import { z } from 'zod';

/**
 * Schema for a stock quote (market data)
 */
export const StockQuoteSchema = z.object({
  _id: z.string().optional(),
  symbol: z.string(),
  name: z.string(),
  sector: z.string(),
  currency: z.string(),
  currentPrice: z.number(),
  previousClose: z.number(),
  dayChangePercentage: z.number(),
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
