import { EmptyState } from '../../../shared/components/EmptyState';
import type { OrderRecord } from '../../../shared/api/types';
import { formatDateTime } from '../../../shared/utils/format';
import { AnimatedCurrency } from '../../../shared/components/AnimatedCurrency';
import { surface } from '../../../shared/design-system/surfaces';
import { table } from '../../../shared/design-system';
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
            <th className={table.header}>Accion</th>
            <th className={table.header}>Lado</th>
            <th className={table.header}>Modalidad</th>
            <th className={table.header}>Cantidad</th>
            <th className={table.header}>Limite</th>
            <th className={table.header}>Estado</th>
            <th className={`whitespace-nowrap ${table.header}`}>Creada</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className={`${table.rowBorder} transition-colors duration-[var(--main-page-transition)]`}>
              <td className={table.cell} data-label="Accion">{order.symbol}</td>
              <td className={table.cell} data-label="Lado">
                {order.side === 'BUY' ? 'Compra' : 'Venta'}
              </td>
              <td className={table.cell} data-label="Modalidad">
                {order.type === 'MARKET' ? 'Mercado' : 'Limite'}
              </td>
              <td className={table.cell} data-label="Cantidad">{order.quantity}</td>
              <td className={table.cell} data-label="Limite">
                {order.type === 'MARKET' || order.limitPrice == null
                  ? '—'
                  : <AnimatedCurrency value={order.limitPrice} currency={currency} rate={rate} />}
              </td>
              <td className={table.cell} data-label="Estado">{order.status}</td>
              <td className={`whitespace-nowrap ${table.cell}`} data-label="Creada">{formatDateTime(order.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
