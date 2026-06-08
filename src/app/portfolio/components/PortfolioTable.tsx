import { EmptyState } from '../../../shared/components/EmptyState';
import type { PortfolioPosition } from '../../../shared/api/types';
import { formatCurrency } from '../../../shared/utils/format';
import { labels, portfolio } from '../../../shared/content/strings';
import { surface } from '../../../shared/design-system/surfaces';
import { textPositive, textNegative } from '../../../shared/design-system/typography';
import '../../../shared/design-system/table.css';

interface PortfolioTableProps {
  positions: PortfolioPosition[];
  currency: 'CLP' | 'USD';
  rate: number;
}

export function PortfolioTable({ positions, currency, rate }: PortfolioTableProps) {
  if (!positions.length) {
    return (
      <EmptyState
        description={portfolio.emptyDescription}
        title={portfolio.emptyTitle}
      />
    );
  }

  return (
    <div className={`${surface.tableWrapper} responsive-table`}>
      <table className="w-full min-w-[640px] border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">{labels.table.symbol}</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">{labels.table.quantity}</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">{labels.table.reserved}</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">{labels.table.avgCost}</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">{labels.table.currentPrice}</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">{labels.table.value}</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">{labels.table.pL}</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((position) => (
            <tr key={position.symbol} className="border-b border-[var(--main-page-border)] transition-colors duration-[var(--main-page-transition)]">
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label={labels.table.symbol}>{position.symbol}</td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label={labels.table.quantity}>{position.quantity}</td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label={labels.table.reserved}>{position.reservedQuantity}</td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label={labels.table.avgCost}>
                {formatCurrency(position.averageCost, { currency, rate })}
              </td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label={labels.table.currentPrice}>
                {formatCurrency(position.marketPrice, { currency, rate })}
              </td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label={labels.table.value}>{formatCurrency(position.marketValue, { currency, rate })}</td>
              <td
                className={`p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)] ${position.unrealizedProfitLoss >= 0 ? textPositive : textNegative}`}
                data-label={labels.table.pL}
              >
                {formatCurrency(position.unrealizedProfitLoss, { currency, rate })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
