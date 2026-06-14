import { convertCurrency } from './currency';
import type { Currency } from './currency';

export interface FormatCurrencyOptions {
  currency?: Currency;
  sourceCurrency?: Currency;
  rate?: number;
}

export function formatCurrency(value: number, opts?: FormatCurrencyOptions) {
  const currency = opts?.currency ?? 'CLP';
  const sourceCurrency = opts?.sourceCurrency ?? 'CLP';
  const rate = opts?.rate ?? 950;
  const displayValue = convertCurrency(value, sourceCurrency, currency, rate);

  const formattedNumber = new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: currency === 'CLP' ? 0 : 2,
    maximumFractionDigits: currency === 'CLP' ? 0 : 2,
  }).format(displayValue);

  const formatted = currency === 'CLP'
    ? `$${formattedNumber}`
    : `USD ${formattedNumber}`;

  return formatted;
}

export function formatBothCurrencies(clpValue: number, rate: number) {
  const clp = formatCurrency(clpValue, { currency: 'CLP' });
  const usd = formatCurrency(clpValue, { currency: 'USD', rate });
  return `${clp} (${usd})`;
}

export function formatPercentage(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export function formatDateTime(value?: string) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}
