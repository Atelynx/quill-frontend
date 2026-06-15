import { describe, expect, it } from 'vitest';
import { CreateOrderInputSchema } from './orders';

const baseOrder = {
  symbol: 'AAPL',
  side: 'BUY' as const,
  quantity: 1,
};

describe('CreateOrderInputSchema', () => {
  it('exige un precio limite positivo para ordenes LIMIT', () => {
    expect(CreateOrderInputSchema.safeParse({ ...baseOrder, type: 'LIMIT' }).success).toBe(false);
    expect(CreateOrderInputSchema.safeParse({ ...baseOrder, type: 'LIMIT', limitPrice: 0 }).success).toBe(false);
    expect(CreateOrderInputSchema.safeParse({ ...baseOrder, type: 'LIMIT', limitPrice: 100 }).success).toBe(true);
  });

  it('permite omitir el precio limite para ordenes MARKET', () => {
    expect(CreateOrderInputSchema.safeParse({ ...baseOrder, type: 'MARKET' }).success).toBe(true);
  });
});
