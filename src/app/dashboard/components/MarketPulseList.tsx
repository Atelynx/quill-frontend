import type { StockQuote } from '../../../shared/api/types';
import { formatPercentage } from '../../../shared/utils/format';
import { AnimatedCurrency } from '../../../shared/components/AnimatedCurrency';
import { marketPulseGrid } from '../../../shared/design-system/layout';
import { textPositive, textNegative } from '../../../shared/design-system/typography';

interface MarketPulseListProps {
  quotes: StockQuote[];
  currency: 'CLP' | 'USD';
  rate: number;
}

export function MarketPulseList({ quotes, currency, rate }: MarketPulseListProps) {
  return (
    <div className={marketPulseGrid}>
      {quotes.map((quote) => (
        <article key={quote.symbol} className="flex justify-between gap-4 rounded-[var(--main-page-radius-md)] border border-[var(--main-page-border)] p-4 shadow-[var(--main-page-shadow-soft)] [background:var(--gradient-pulse-card)]">
          <div>
            <span className="block text-[var(--main-page-text-muted)]">{quote.symbol}</span>
            <strong className="mt-[0.2rem] block">{quote.name}</strong>
          </div>
          <div>
            <b className="block"><AnimatedCurrency value={quote.close} currency={currency} rate={rate} /></b>
            <small className={`mt-[0.28rem] block font-semibold ${quote.dayChangePercentage >= 0 ? textPositive : textNegative}`}>
              {formatPercentage(quote.dayChangePercentage)}
            </small>
          </div>
        </article>
      ))}
    </div>
  );
}
