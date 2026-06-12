import { describe, expect, it } from 'vitest'
import { convertCurrency, resolveCurrency } from './currency'
import { formatCurrency } from './format'

describe('currency utilities', () => {
  it('formatea CLP sin decimales', () => {
    expect(formatCurrency(1250, { currency: 'CLP' })).toBe('$1.250')
  })

  it('formatea USD con decimales', () => {
    expect(formatCurrency(12.5, { currency: 'USD', sourceCurrency: 'USD' }))
      .toBe('USD 12,50')
  })

  it('convierte USD a CLP', () => {
    expect(convertCurrency(100, 'USD', 'CLP', 950)).toBe(95_000)
  })

  it('convierte CLP a USD', () => {
    expect(convertCurrency(95_000, 'CLP', 'USD', 950)).toBe(100)
  })

  it('rechaza una tasa ausente o invalida cuando debe convertir', () => {
    expect(() => convertCurrency(100, 'USD', 'CLP', 0)).toThrow(RangeError)
  })

  it('rechaza monedas no soportadas', () => {
    expect(() => resolveCurrency('EUR')).toThrow(RangeError)
  })
})
