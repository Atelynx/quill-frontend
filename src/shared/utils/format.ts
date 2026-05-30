export interface FormatCurrencyOptions {
  currency?: 'CLP' | 'USD';
  rate?: number;
}

export function formatCurrency(value: number, opts?: FormatCurrencyOptions) {
  const currency = opts?.currency ?? 'CLP';
  const rate = opts?.rate ?? 950;

  const displayValue = currency === 'USD' ? value / rate : value;

  const formatted = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'CLP' ? 0 : 2,
    maximumFractionDigits: currency === 'CLP' ? 0 : 2,
  }).format(displayValue);

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
