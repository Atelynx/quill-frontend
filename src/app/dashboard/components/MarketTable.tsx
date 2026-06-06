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
  watchlist?: string[];
  onToggleWatchlist?: (symbol: string) => void;
}

const movementColor: Record<string, string> = {
  up: 'text-[var(--color-accent)]',
  down: 'text-[var(--main-page-danger)]',
  steady: '',
}

export function MarketTable({
  quotes,
  selectedSymbol,
  onSelect,
  movementBySymbol,
  currency,
  rate,
  watchlist,
  onToggleWatchlist,
}: MarketTableProps) {
  return (
    <div className={`${surface.tableWrapper} responsive-table`}>
      <table className="w-full min-w-[640px] border-separate border-spacing-0">
        <thead>
          <tr>
            {watchlist !== undefined ? (
              <th className="w-10 p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]"></th>
            ) : null}
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">Simbolo</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">Empresa</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">Precio</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">Variacion</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => {
            const isSelected = quote.symbol === selectedSymbol;
            const isWatched = watchlist?.includes(quote.symbol) ?? false;

            return (
            <tr
              key={quote.symbol}
              onClick={() => onSelect(quote.symbol)}
              aria-selected={isSelected}
              className={`border-b border-[var(--main-page-border)] transition-colors duration-[var(--main-page-transition)] hover:bg-[color-mix(in_srgb,var(--color-accent)_8%,_transparent)] ${isSelected ? 'bg-[color-mix(in_srgb,var(--color-accent)_10%,_transparent)] shadow-[inset_4px_0_0_var(--color-accent)]' : ''}`}
            >
              {watchlist !== undefined ? (
                <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist?.(quote.symbol);
                    }}
                    className={`text-lg leading-none transition-colors ${
                      isWatched
                        ? 'text-[var(--color-accent)]'
                        : 'text-[var(--main-page-text-muted)] hover:text-[var(--color-accent)]'
                    }`}
                    aria-label={isWatched ? `Quitar ${quote.symbol} de seguimiento` : `Agregar ${quote.symbol} a seguimiento`}
                  >
                    {isWatched ? '\u2605' : '\u2606'}
                  </button>
                </td>
              ) : null}
              <td className={`p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)] ${isSelected ? 'font-semibold text-[var(--color-accent)]' : ''}`} data-label="Simbolo">{quote.symbol}</td>
              <td className={`p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)] ${isSelected ? 'font-semibold' : ''}`} data-label="Empresa">{quote.name}</td>
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
