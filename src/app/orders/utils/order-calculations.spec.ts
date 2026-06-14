import { describe, expect, it } from 'vitest'
import { calculateQuantityFromClpAmount } from './order-calculations'

describe('calculateQuantityFromClpAmount', () => {
  it('calcula cantidad para un activo cotizado en CLP', () => {
    expect(calculateQuantityFromClpAmount({
      amountClp: 500_000,
      price: 1_000,
      priceCurrency: 'CLP',
      usdclpRate: 950,
    })).toBe(500)
  })

  it('calcula cantidad para un activo cotizado en USD', () => {
    expect(calculateQuantityFromClpAmount({
      amountClp: 500_000,
      price: 100,
      priceCurrency: 'USD',
      usdclpRate: 950,
    })).toBe(5)
  })

  it('rechaza una tasa invalida para un activo USD', () => {
    expect(() => calculateQuantityFromClpAmount({
      amountClp: 500_000,
      price: 100,
      priceCurrency: 'USD',
      usdclpRate: 0,
    })).toThrow(RangeError)
  })
})
