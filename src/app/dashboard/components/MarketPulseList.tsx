import type { StockQuote } from '../../../shared/api/types';
import { formatCurrency, formatPercentage } from '../../../shared/utils/format';

interface MarketPulseListProps {
  quotes: StockQuote[];
  currency: 'CLP' | 'USD';
  rate: number;
}

export function MarketPulseList({ quotes, currency, rate }: MarketPulseListProps) {
  return (
    <div className="market-pulse-list">
      {quotes.map((quote) => (
        <article className="market-pulse-card" key={quote.symbol}>
          <div>
            <span>{quote.symbol}</span>
            <strong>{quote.name}</strong>
          </div>
          <div>
            <b>{formatCurrency(quote.close, { currency, rate })}</b>
            <small
              className={
                quote.dayChangePercentage >= 0 ? 'text-positive' : 'text-negative'
              }
            >
              {formatPercentage(quote.dayChangePercentage)}
            </small>
          </div>
        </article>
      ))}
    </div>
  );
}
