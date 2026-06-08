import { surface } from '../../../shared/design-system/surfaces';
import { textPositive, textNegative } from '../../../shared/design-system/typography';
import { AnimatedCurrency } from '../../../shared/components/AnimatedCurrency';
import { AnimatedInteger } from '../../../shared/components/AnimatedInteger';

interface SummaryCardProps {
  label: string;
  value: number;
  tone?: 'neutral' | 'positive' | 'negative';
  currency?: 'CLP' | 'USD';
  rate?: number;
}

const strongClass: Record<string, string> = {
  neutral: '',
  positive: textPositive,
  negative: textNegative,
}

const borderClass: Record<string, string> = {
  neutral: '',
  positive: 'border-[color-mix(in_srgb,var(--color-accent)_20%,_transparent)]',
  negative: 'border-[rgba(181,58,38,0.22)]',
}

export function SummaryCard({ label, value, tone = 'neutral', currency, rate }: SummaryCardProps) {
  return (
    <article className={`${surface.summaryCard} ${borderClass[tone]}`}>
      <span className="block text-[0.9rem] text-[var(--main-page-text-soft)]">{label}</span>
      <strong className={`mt-[0.45rem] block text-[1.45rem] ${strongClass[tone]}`}>
        {currency ? (
          <AnimatedCurrency value={value} currency={currency} rate={rate} />
        ) : (
          <AnimatedInteger value={value} />
        )}
      </strong>
    </article>
  );
}
