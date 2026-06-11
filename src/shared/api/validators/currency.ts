import { z } from 'zod';

export const CurrencyRateSchema = z.object({
  symbol: z.string(),
  rate: z.number(),
  basePrice: z.number(),
  dayChangePercentage: z.number(),
});

export type CurrencyRate = z.infer<typeof CurrencyRateSchema>;
