import { EmptyState } from '../../../shared/components/EmptyState';
import type { OrderRecord } from '../../../shared/api/types';
import { formatCurrency, formatDateTime } from '../../../shared/utils/format';

interface OrdersTableProps {
  orders: OrderRecord[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  if (!orders.length) {
    return (
      <EmptyState
        description="Tus ordenes pendientes apareceran aqui apenas registres una compra o venta limitada."
        title="Todavia no hay ordenes abiertas"
      />
    );
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Accion</th>
            <th>Lado</th>
            <th>Cantidad</th>
            <th>Limite</th>
            <th>Estado</th>
            <th>Creada</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td data-label="Accion">{order.symbol}</td>
              <td data-label="Lado">
                {order.side === 'BUY' ? 'Compra' : 'Venta'}
              </td>
              <td data-label="Cantidad">{order.quantity}</td>
              <td data-label="Limite">{formatCurrency(order.limitPrice)}</td>
              <td data-label="Estado">{order.status}</td>
              <td data-label="Creada">{formatDateTime(order.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
