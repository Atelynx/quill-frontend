import { z } from 'zod';

/**
 * Schema for a portfolio position (individual stock holding)
 */
export const PortfolioPositionSchema = z.object({
  symbol: z.string(),
  quantity: z.number(),
  reservedQuantity: z.number(),
  averageCost: z.number(),
  marketPrice: z.number(),
  marketValue: z.number(),
  unrealizedProfitLoss: z.number(),
});

export type PortfolioPosition = z.infer<typeof PortfolioPositionSchema>;

/**
 * Schema for portfolio summary (overall portfolio state)
 */
export const PortfolioSummarySchema = z.object({
  availableBalance: z.number(),
  reservedBalance: z.number(),
  investedValue: z.number(),
  totalEquity: z.number(),
  unrealizedProfitLoss: z.number(),
  positions: z.array(PortfolioPositionSchema),
});

export type PortfolioSummary = z.infer<typeof PortfolioSummarySchema>;
