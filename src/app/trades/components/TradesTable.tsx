import { EmptyState } from '../../../shared/components/EmptyState';
import type { TradeRecord } from '../../../shared/api/types';
import { formatCurrency, formatDateTime } from '../../../shared/utils/format';
import { labels, tradesTable } from '../../../shared/content/strings';
import { surface } from '../../../shared/design-system/surfaces';
import '../../../shared/design-system/table.css';

interface TradesTableProps {
  trades: TradeRecord[];
  currency: 'CLP' | 'USD';
  rate: number;
}

export function TradesTable({ trades, currency, rate }: TradesTableProps) {
  if (!trades.length) {
    return (
      <EmptyState
        description={tradesTable.emptyDescription}
        title={tradesTable.emptyTitle}
      />
    );
  }

  return (
    <div className={`${surface.tableWrapper} responsive-table`}>
      <table className="w-full min-w-[640px] border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">{labels.table.date}</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">{labels.table.symbol}</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">{labels.table.side}</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">{labels.table.quantity}</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">{labels.table.price}</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">{labels.table.commission}</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">{labels.table.net}</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => (
            <tr key={trade._id} className="border-b border-[var(--main-page-border)] transition-colors duration-[var(--main-page-transition)]">
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label={labels.table.date}>{formatDateTime(trade.executedAt)}</td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label={labels.table.symbol}>{trade.symbol}</td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label={labels.table.side}>
                {trade.side === 'BUY' ? labels.action.buy : labels.action.sell}
              </td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label={labels.table.quantity}>{trade.quantity}</td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label={labels.table.price}>
                {formatCurrency(trade.executionPrice, { currency, rate })}
              </td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label={labels.table.commission}>
                {formatCurrency(trade.commissionAmount, { currency, rate })}
              </td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label={labels.table.net}>{formatCurrency(trade.netAmount, { currency, rate })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
