import { z } from 'zod';

export const AdminStockSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  currency: z.enum(['CLP', 'USD']),
  close: z.number(),
  open: z.number().optional(),
  high: z.number().optional(),
  low: z.number().optional(),
  previousClose: z.number(),
  dayChangePercentage: z.number(),
  source: z.string(),
  volume: z.number().optional(),
  baseVolatility: z.number().optional(),
  baseDrift: z.number().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type AdminStock = z.infer<typeof AdminStockSchema>;

export const AdminStockListResponseSchema = z.object({
  data: z.array(AdminStockSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});

export type AdminStockListResponse = z.infer<typeof AdminStockListResponseSchema>;

export const CreateStockInputSchema = z.object({
  symbol: z.string().min(1, 'El símbolo es obligatorio.'),
  name: z.string().min(1, 'El nombre es obligatorio.'),
  currency: z.enum(['CLP', 'USD']).optional(),
  close: z.number().positive('El precio debe ser positivo.'),
  baseVolatility: z.number().optional(),
  baseDrift: z.number().optional(),
});

export type CreateStockInput = z.infer<typeof CreateStockInputSchema>;

export const UpdateStockPriceInputSchema = z.object({
  price: z.number().positive('El precio debe ser positivo.'),
});

export type UpdateStockPriceInput = z.infer<typeof UpdateStockPriceInputSchema>;
