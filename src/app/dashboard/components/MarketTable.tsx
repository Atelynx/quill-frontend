import type { StockQuote } from '../../../shared/api/types';
import { formatCurrency, formatPercentage } from '../../../shared/utils/format';
import { surface } from '../../../shared/design-system/surfaces';
import { textPositive, textNegative } from '../../../shared/design-system/typography';
import '../../../shared/design-system/table.css';

interface MarketTableProps {
  quotes: StockQuote[];
  selectedSymbol: string;
  onSelect: (symbol: string) => void;
  movementBySymbol: Record<string, 'up' | 'down' | 'steady'>;
  currency: 'CLP' | 'USD';
  rate: number;
}

const movementColor: Record<string, string> = {
  up: 'text-[var(--color-accent)]',
  down: 'text-[var(--main-page-danger)]',
  steady: '',
}

export function MarketTable({
  quotes,
  onSelect,
  movementBySymbol,
  currency,
  rate,
}: MarketTableProps) {
  return (
    <div className={`${surface.tableWrapper} responsive-table`}>
      <table className="w-full min-w-[640px] border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">Simbolo</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">Empresa</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">Precio</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">Variacion</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => (
            <tr
              key={quote.symbol}
              onClick={() => onSelect(quote.symbol)}
              className="border-b border-[var(--main-page-border)] transition-colors duration-[var(--main-page-transition)] hover:bg-[color-mix(in_srgb,var(--color-accent)_8%,_transparent)] [&.is-selected]:bg-[color-mix(in_srgb,var(--color-accent)_8%,_transparent)]"
            >
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label="Simbolo">{quote.symbol}</td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label="Empresa">{quote.name}</td>
              <td
                className={`p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)] transition-all duration-[var(--main-page-transition)] ${movementColor[movementBySymbol[quote.symbol] ?? 'steady']}`}
                data-label="Precio"
              >
                {formatCurrency(quote.close, { currency, rate })}
              </td>
              <td
                className={`p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)] ${quote.dayChangePercentage >= 0 ? textPositive : textNegative}`}
                data-label="Variacion"
              >
                {formatPercentage(quote.dayChangePercentage)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
