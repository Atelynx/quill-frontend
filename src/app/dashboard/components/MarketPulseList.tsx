import type { StockQuote } from '../../../shared/api/types';
import { formatPercentage } from '../../../shared/utils/format';
import { AnimatedCurrency } from '../../../shared/components/AnimatedCurrency';
import { surface, gradient } from '../../../shared/design-system/surfaces';
import { marketPulseGrid } from '../../../shared/design-system/layout';
import { textPositive, textNegative, textMuted } from '../../../shared/design-system/typography';

interface MarketPulseListProps {
  quotes: StockQuote[];
  currency: 'CLP' | 'USD';
  rate: number;
}

export function MarketPulseList({ quotes, currency, rate }: MarketPulseListProps) {
  return (
    <div className={marketPulseGrid}>
      {quotes.map((quote) => (
        <article key={quote.symbol} className={`flex justify-between gap-4 ${surface.innerCard} shadow-[var(--main-page-shadow-soft)] ${gradient.pulseCard}`}>
          <div>
            <span className={`block ${textMuted}`}>{quote.symbol}</span>
            <strong className="mt-[0.2rem] block">{quote.name}</strong>
          </div>
          <div>
            <b className="block"><AnimatedCurrency value={quote.close} currency={currency} sourceCurrency={quote.currency} rate={rate} /></b>
            <small className={`mt-[0.28rem] block font-semibold ${quote.dayChangePercentage >= 0 ? textPositive : textNegative}`}>
              {formatPercentage(quote.dayChangePercentage)}
            </small>
          </div>
        </article>
      ))}
    </div>
  );
}
