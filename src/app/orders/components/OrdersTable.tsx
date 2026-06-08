import { EmptyState } from '../../../shared/components/EmptyState';
import type { OrderRecord } from '../../../shared/api/types';
import { formatCurrency, formatDateTime } from '../../../shared/utils/format';
import { labels, ordersTable } from '../../../shared/content/strings';
import { surface } from '../../../shared/design-system/surfaces';
import '../../../shared/design-system/table.css';

interface OrdersTableProps {
  orders: OrderRecord[];
  currency: 'CLP' | 'USD';
  rate: number;
}

export function OrdersTable({ orders, currency, rate }: OrdersTableProps) {
  if (!orders.length) {
    return (
      <EmptyState
        description={ordersTable.emptyDescription}
        title={ordersTable.emptyTitle}
      />
    );
  }

  return (
    <div className={`${surface.tableWrapper} responsive-table`}>
      <table className="w-full min-w-[640px] border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">{labels.table.symbol}</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">{labels.table.side}</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">{labels.table.type}</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">{labels.table.quantity}</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">{labels.table.limit}</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">{labels.table.status}</th>
            <th className="whitespace-nowrap p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">{labels.table.created}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b border-[var(--main-page-border)] transition-colors duration-[var(--main-page-transition)]">
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label={labels.table.symbol}>{order.symbol}</td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label={labels.table.side}>
                {order.side === 'BUY' ? labels.action.buy : labels.action.sell}
              </td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label={labels.table.type}>
                {order.type === 'MARKET' ? labels.action.market : labels.action.limit}
              </td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label={labels.table.quantity}>{order.quantity}</td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label={labels.table.limit}>
                {order.type === 'MARKET' || order.limitPrice == null
                  ? '—'
                  : formatCurrency(order.limitPrice, { currency, rate })}
              </td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label="Estado">{order.status}</td>
              <td className="whitespace-nowrap p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label="Creada">{formatDateTime(order.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
