import { EmptyState } from '../../../shared/components/EmptyState';
import type { TradeRecord } from '../../../shared/api/types';
import { formatDateTime } from '../../../shared/utils/format';
import { AnimatedCurrency } from '../../../shared/components/AnimatedCurrency';
import { surface } from '../../../shared/design-system/surfaces';
import { table } from '../../../shared/design-system';
import '../../../shared/design-system/table.css';

interface TradesTableProps {
  trades?: TradeRecord[];
  currency: 'CLP' | 'USD';
  hasError?: boolean;
  rate: number;
}

export function TradesTable({
  trades = [],
  currency,
  hasError = false,
  rate,
}: TradesTableProps) {
  if (hasError) {
    return (
      <EmptyState
        description="No fue posible cargar las operaciones recientes. Intenta nuevamente cuando el servicio esté disponible."
        title="Operaciones no disponibles"
      />
    );
  }

  if (trades.length === 0) {
    return (
      <EmptyState
        description="Tus compras y ventas ejecutadas quedaran registradas aqui con precio, comision y monto neto."
        title="Aun no hay operaciones ejecutadas"
      />
    );
  }

  return (
    <div className={`${surface.tableWrapper} responsive-table`}>
      <table className="w-full min-w-[640px] border-separate border-spacing-0">
        <thead>
          <tr>
            <th className={table.header}>Fecha</th>
            <th className={table.header}>Accion</th>
            <th className={table.header}>Lado</th>
            <th className={table.header}>Cantidad</th>
            <th className={table.header}>Precio</th>
            <th className={table.header}>Comision</th>
            <th className={table.header}>Neto</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => (
            <tr key={trade._id} className={`${table.rowBorder} transition-colors duration-[var(--main-page-transition)]`}>
              <td className={table.cell} data-label="Fecha">{formatDateTime(trade.executedAt)}</td>
              <td className={table.cell} data-label="Accion">{trade.symbol}</td>
              <td className={table.cell} data-label="Lado">
                {trade.side === 'BUY' ? 'Compra' : 'Venta'}
              </td>
              <td className={table.cell} data-label="Cantidad">{trade.quantity}</td>
              <td className={table.cell} data-label="Precio">
                <AnimatedCurrency value={trade.executionPrice} currency={currency} rate={rate} />
              </td>
              <td className={table.cell} data-label="Comision">
                <AnimatedCurrency value={trade.commissionAmount} currency={currency} rate={rate} />
              </td>
              <td className={table.cell} data-label="Neto"><AnimatedCurrency value={trade.netAmount} currency={currency} rate={rate} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
