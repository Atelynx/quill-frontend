import NumberFlow from '@number-flow/react'

interface AnimatedCurrencyProps {
  value: number
  currency?: 'CLP' | 'USD'
  rate?: number
  className?: string
}

export function AnimatedCurrency({
  value,
  currency = 'CLP',
  rate = 950,
  className,
}: AnimatedCurrencyProps) {
  const displayValue = currency === 'USD' ? value / rate : value

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
