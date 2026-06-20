import { EmptyState } from '../../../shared/components/EmptyState';
import type { PortfolioPosition } from '../../../shared/api/types';
import { AnimatedCurrency } from '../../../shared/components/AnimatedCurrency';
import { surface } from '../../../shared/design-system/surfaces';
import { textPositive, textNegative } from '../../../shared/design-system/typography';
import { table } from '../../../shared/design-system';
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
            <th className={table.header}>Accion</th>
            <th className={table.header}>Cantidad</th>
            <th className={table.header}>Reservadas</th>
            <th className={table.header}>Costo promedio</th>
            <th className={table.header}>Precio actual</th>
            <th className={table.header}>Valor</th>
            <th className={table.header}>P/L</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((position) => (
            <tr key={position.symbol} className={`${table.rowBorder} transition-colors duration-[var(--main-page-transition)]`}>
              <td className={table.cell} data-label="Accion">{position.symbol}</td>
              <td className={table.cell} data-label="Cantidad">{position.quantity}</td>
              <td className={table.cell} data-label="Reservadas">{position.reservedQuantity}</td>
              <td className={table.cell} data-label="Costo promedio">
                <AnimatedCurrency value={position.averageCost} currency={currency} rate={rate} />
              </td>
              <td className={table.cell} data-label="Precio actual">
                <AnimatedCurrency value={position.marketPrice} currency={currency} rate={rate} />
              </td>
              <td className={table.cell} data-label="Valor"><AnimatedCurrency value={position.marketValue} currency={currency} rate={rate} /></td>
              <td
                className={`${table.cell} ${position.unrealizedProfitLoss >= 0 ? textPositive : textNegative}`}
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
