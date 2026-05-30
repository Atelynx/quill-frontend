import { EmptyState } from '../../../shared/components/EmptyState';
import type { TradeRecord } from '../../../shared/api/types';
import { formatCurrency, formatDateTime } from '../../../shared/utils/format';

interface TradesTableProps {
  trades: TradeRecord[];
  currency: 'CLP' | 'USD';
  rate: number;
}

export function TradesTable({ trades, currency, rate }: TradesTableProps) {
  if (!trades.length) {
    return (
      <EmptyState
        description="Tus compras y ventas ejecutadas quedaran registradas aqui con precio, comision y monto neto."
        title="Aun no hay operaciones ejecutadas"
      />
    );
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Accion</th>
            <th>Lado</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Comision</th>
            <th>Neto</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => (
            <tr key={trade._id}>
              <td data-label="Fecha">{formatDateTime(trade.executedAt)}</td>
              <td data-label="Accion">{trade.symbol}</td>
              <td data-label="Lado">
                {trade.side === 'BUY' ? 'Compra' : 'Venta'}
              </td>
              <td data-label="Cantidad">{trade.quantity}</td>
              <td data-label="Precio">
                {formatCurrency(trade.executionPrice, { currency, rate })}
              </td>
              <td data-label="Comision">
                {formatCurrency(trade.commissionAmount, { currency, rate })}
              </td>
              <td data-label="Neto">{formatCurrency(trade.netAmount, { currency, rate })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
