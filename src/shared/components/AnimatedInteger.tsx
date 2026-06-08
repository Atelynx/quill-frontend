import NumberFlow from '@number-flow/react'

interface AnimatedIntegerProps {
  value: number
  className?: string
}

export function AnimatedInteger({ value, className }: AnimatedIntegerProps) {
  return (
    <NumberFlow
      value={value}
      locales="es-CL"
      format={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
      className={className}
    />
  )
}
