import { EmptyState } from '../../../shared/components/EmptyState';
import type { OrderRecord } from '../../../shared/api/types';
import { formatCurrency, formatDateTime } from '../../../shared/utils/format';
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
        description="Tus ordenes pendientes apareceran aqui apenas registres una compra o venta limitada."
        title="Todavia no hay ordenes abiertas"
      />
    );
  }

  return (
    <div className={`${surface.tableWrapper} responsive-table`}>
      <table className="w-full min-w-[640px] border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">Accion</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">Lado</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">Modalidad</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">Cantidad</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">Limite</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">Estado</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">Creada</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b border-[var(--main-page-border)] transition-colors duration-[var(--main-page-transition)]">
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label="Accion">{order.symbol}</td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label="Lado">
                {order.side === 'BUY' ? 'Compra' : 'Venta'}
              </td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label="Modalidad">
                {order.type === 'MARKET' ? 'Mercado' : 'Limite'}
              </td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label="Cantidad">{order.quantity}</td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label="Limite">
                {order.type === 'MARKET' || order.limitPrice == null
                  ? '—'
                  : formatCurrency(order.limitPrice, { currency, rate })}
              </td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label="Estado">{order.status}</td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label="Creada">{formatDateTime(order.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
