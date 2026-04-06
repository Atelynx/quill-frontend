import type { StockQuote } from '../../../shared/api/types';
import { formatCurrency, formatPercentage } from '../../../shared/utils/format';

interface MarketTableProps {
  quotes: StockQuote[];
  selectedSymbol: string;
  onSelect: (symbol: string) => void;
  movementBySymbol: Record<string, 'up' | 'down' | 'steady'>;
}

export function MarketTable({
  quotes,
  selectedSymbol,
  onSelect,
  movementBySymbol,
}: MarketTableProps) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Simbolo</th>
            <th>Empresa</th>
            <th>Sector</th>
            <th>Precio</th>
            <th>Variacion</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => (
            <tr
              className={quote.symbol === selectedSymbol ? 'is-selected' : ''}
              key={quote.symbol}
              onClick={() => onSelect(quote.symbol)}
            >
              <td data-label="Simbolo">{quote.symbol}</td>
              <td data-label="Empresa">{quote.name}</td>
              <td data-label="Sector">{quote.sector}</td>
              <td
                className={`price-cell price-cell--${
                  movementBySymbol[quote.symbol] ?? 'steady'
                }`}
                data-label="Precio"
              >
                {formatCurrency(quote.currentPrice)}
              </td>
              <td
                className={
                  quote.dayChangePercentage >= 0 ? 'text-positive' : 'text-negative'
                }
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
