export type Currency = 'CLP' | 'USD'

export function isCurrency(value: string): value is Currency {
  return value === 'CLP' || value === 'USD'
}

function assertValidRate(rate: number) {
  if (!Number.isFinite(rate) || rate <= 0) {
    throw new RangeError('La tasa USDCLP debe ser mayor que cero.')
  }
}

export function convertCurrency(
  value: number,
  sourceCurrency: Currency,
  targetCurrency: Currency,
  usdclpRate: number,
) {
  if (sourceCurrency === targetCurrency) {
    return value
  }

  assertValidRate(usdclpRate)
  return sourceCurrency === 'USD' ? value * usdclpRate : value / usdclpRate
}

export function resolveCurrency(value: string): Currency {
  if (!isCurrency(value)) {
    throw new RangeError(`Moneda no soportada: ${value}`)
  }

  return value
}
