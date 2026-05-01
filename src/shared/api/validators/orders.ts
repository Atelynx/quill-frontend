import { z } from 'zod';

/**
 * Schema for order record (from server)
 */
export const OrderRecordSchema = z.object({
  _id: z.string(),
  symbol: z.string(),
  side: z.enum(['BUY', 'SELL']),
  quantity: z.number().int().positive(),
  limitPrice: z.number().positive(),
  status: z.enum(['PENDING', 'EXECUTED', 'CANCELLED']),
  executionPrice: z.number().optional(),
  commissionAmount: z.number().optional(),
  createdAt: z.string().datetime(),
  executedAt: z.string().datetime().optional(),
});

export type OrderRecord = z.infer<typeof OrderRecordSchema>;

/**
 * Schema for creating a new order (client input)
 */
export const CreateOrderInputSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required'),
  side: z.enum(['BUY', 'SELL']),
  quantity: z.number().int().positive('Quantity must be positive'),
  limitPrice: z.number().positive('Price must be positive'),
});

export type CreateOrderInput = z.infer<typeof CreateOrderInputSchema>;
