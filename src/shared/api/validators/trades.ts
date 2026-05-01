import { z } from 'zod';

/**
 * Schema for a trade record (executed trade)
 */
export const TradeRecordSchema = z.object({
  _id: z.string(),
  symbol: z.string(),
  side: z.enum(['BUY', 'SELL']),
  quantity: z.number().int().positive(),
  executionPrice: z.number().positive(),
  grossAmount: z.number(),
  commissionAmount: z.number(),
  netAmount: z.number(),
  executedAt: z.string().datetime(),
});

export type TradeRecord = z.infer<typeof TradeRecordSchema>;
