import { z } from 'zod';

/**
 * Schema for a stock quote (market data)
 */
const StockQuoteRawSchema = z.object({
  _id: z.string().optional(),
  symbol: z.string(),
  name: z.string(),
  currency: z.string(),
  close: z.number().optional(),
  currentPrice: z.number().optional(),
  open: z.number().optional(),
  high: z.number().optional(),
  low: z.number().optional(),
  previousClose: z.number(),
  dayChangePercentage: z.number(),
  source: z.string().optional(),
  volume: z.number().optional(),
  lastMarketDate: z.string().datetime().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  sector: z.string().optional(),
});

export const StockQuoteSchema = StockQuoteRawSchema.transform((quote, ctx) => {
  const close = quote.close ?? quote.currentPrice;

  if (close === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'La cotizacion no incluye close ni currentPrice.',
    });
    return z.NEVER;
  }

  const normalizedQuote = { ...quote };
  delete normalizedQuote.currentPrice;

  return {
    ...normalizedQuote,
    close,
  };
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
