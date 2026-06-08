import { EmptyState } from '../../../shared/components/EmptyState';
import type { PortfolioPosition } from '../../../shared/api/types';
import { AnimatedCurrency } from '../../../shared/components/AnimatedCurrency';
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
        description="Cuando compres una accion ejecutada, Quill mostrara aqui tu cantidad, costo promedio y resultado no realizado."
        title="Tu portafolio todavia esta vacio"
      />
    );
  }

  return (
    <div className={`${surface.tableWrapper} responsive-table`}>
      <table className="w-full min-w-[640px] border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">Accion</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">Cantidad</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">Reservadas</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">Costo promedio</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">Precio actual</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">Valor</th>
            <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)] bg-[color-mix(in_srgb,var(--color-text)_2.5%,_transparent)]">P/L</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((position) => (
            <tr key={position.symbol} className="border-b border-[var(--main-page-border)] transition-colors duration-[var(--main-page-transition)]">
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label="Accion">{position.symbol}</td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label="Cantidad">{position.quantity}</td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label="Reservadas">{position.reservedQuantity}</td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label="Costo promedio">
                <AnimatedCurrency value={position.averageCost} currency={currency} rate={rate} />
              </td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label="Precio actual">
                <AnimatedCurrency value={position.marketPrice} currency={currency} rate={rate} />
              </td>
              <td className="p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)]" data-label="Valor"><AnimatedCurrency value={position.marketValue} currency={currency} rate={rate} /></td>
              <td
                className={`p-[0.85rem_0.75rem] text-left border-b border-[var(--main-page-border)] ${position.unrealizedProfitLoss >= 0 ? textPositive : textNegative}`}
                data-label="P/L"
              >
                <AnimatedCurrency value={position.unrealizedProfitLoss} currency={currency} rate={rate} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
