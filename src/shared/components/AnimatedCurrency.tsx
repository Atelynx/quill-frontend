import NumberFlow from '@number-flow/react'
import { convertCurrency } from '../utils/currency'
import type { Currency } from '../utils/currency'

interface AnimatedCurrencyProps {
  value: number
  currency?: Currency
  sourceCurrency?: Currency
  rate?: number
  className?: string
}

export function AnimatedCurrency({
  value,
  currency = 'CLP',
  sourceCurrency = 'CLP',
  rate = 950,
  className,
}: AnimatedCurrencyProps) {
  const displayValue = convertCurrency(value, sourceCurrency, currency, rate)

  const isCLP = currency === 'CLP'

  return (
    <NumberFlow
      value={displayValue}
      locales="es-CL"
      format={{
        minimumFractionDigits: isCLP ? 0 : 2,
        maximumFractionDigits: isCLP ? 0 : 2,
      }}
      prefix={isCLP ? '$' : 'USD '}
      className={className}
    />
  )
}
