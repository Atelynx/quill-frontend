import { EmptyState } from '../../../shared/components/EmptyState';
import type { TradeRecord } from '../../../shared/api/types';
import { formatCurrency, formatDateTime } from '../../../shared/utils/format';
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
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">Fecha</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">Accion</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">Lado</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">Cantidad</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">Precio</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">Comision</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">Neto</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => (
            <tr key={trade._id} className="border-b border-[var(--main-page-border)] transition-colors duration-[var(--main-page-transition)]">
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label="Fecha">{formatDateTime(trade.executedAt)}</td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label="Accion">{trade.symbol}</td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label="Lado">
                {trade.side === 'BUY' ? 'Compra' : 'Venta'}
              </td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label="Cantidad">{trade.quantity}</td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label="Precio">
                {formatCurrency(trade.executionPrice, { currency, rate })}
              </td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label="Comision">
                {formatCurrency(trade.commissionAmount, { currency, rate })}
              </td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label="Neto">{formatCurrency(trade.netAmount, { currency, rate })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
