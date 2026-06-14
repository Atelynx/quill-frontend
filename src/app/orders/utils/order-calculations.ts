import { convertCurrency } from '../../../shared/utils/currency'
import type { Currency } from '../../../shared/utils/currency'

interface AmountOrderInput {
  amountClp: number
  price: number
  priceCurrency: Currency
  usdclpRate: number
}

export function calculateQuantityFromClpAmount({
  amountClp,
  price,
  priceCurrency,
  usdclpRate,
}: AmountOrderInput) {
  if (!Number.isFinite(amountClp) || amountClp <= 0 || price <= 0) {
    return 0
  }

  const priceClp = convertCurrency(price, priceCurrency, 'CLP', usdclpRate)
  return Math.floor(amountClp / priceClp)
}
