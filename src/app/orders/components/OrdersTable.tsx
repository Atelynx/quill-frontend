import { useState } from 'react';
import { createPortal } from 'react-dom';
import { EmptyState } from '../../../shared/components/EmptyState';
import type { OrderRecord } from '../../../shared/api/types';
import { formatDateTime } from '../../../shared/utils/format';
import { AnimatedCurrency } from '../../../shared/components/AnimatedCurrency';
import { surface } from '../../../shared/design-system/surfaces';
import { textSoft } from '../../../shared/design-system/typography';
import { table } from '../../../shared/design-system';
import { useCancelOrderMutation } from '../../../shared/api/hooks/mutations';
import '../../../shared/design-system/table.css';

interface OrdersTableProps {
  orders: OrderRecord[];
  currency: 'CLP' | 'USD';
  rate: number;
}

export function OrdersTable({ orders, currency, rate }: OrdersTableProps) {
  const cancelMutation = useCancelOrderMutation();
  const [cancelTarget, setCancelTarget] = useState<OrderRecord | null>(null);

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
            <th className={table.header}>Acciones</th>
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
              <td className={table.cell} data-label="Acciones">
                {order.status === 'PENDING' && (
                  <button
                    onClick={() => setCancelTarget(order)}
                    className="text-red-500 hover:text-red-400 transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {cancelTarget ? createPortal(
        <div className={surface.modalOverlay} onClick={() => setCancelTarget(null)}>
          <div className={surface.modalContentMd} onClick={(e) => e.stopPropagation()}>
            <h3 className="m-0 mb-2 text-text">Cancelar orden</h3>
            <p className={`mb-4 ${textSoft}`}>
              ¿Estas seguro de que deseas cancelar la orden de {cancelTarget.side === 'BUY' ? 'compra' : 'venta'} de {cancelTarget.quantity} acciones de <strong className="text-text">{cancelTarget.symbol}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-[var(--main-page-radius-md)] border border-[var(--main-page-border)] text-[var(--main-page-text-soft)] hover:text-text transition-colors"
                onClick={() => setCancelTarget(null)}
              >
                Volver
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-[var(--main-page-radius-md)] text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'var(--main-page-danger)', borderColor: 'transparent' }}
                onClick={() => {
                  cancelMutation.mutate(cancelTarget._id);
                  setCancelTarget(null);
                }}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? 'Cancelando...' : 'Si, cancelar orden'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      ) : null}
    </div>
  );
}
