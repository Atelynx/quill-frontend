import { EmptyState } from '../../../shared/components/EmptyState';
import type { PortfolioPosition } from '../../../shared/api/types';
import { formatCurrency } from '../../../shared/utils/format';

interface PortfolioTableProps {
  positions: PortfolioPosition[];
}

export function PortfolioTable({ positions }: PortfolioTableProps) {
  if (!positions.length) {
    return (
      <EmptyState
        description="Cuando compres una accion ejecutada, Quill mostrara aqui tu cantidad, costo promedio y resultado no realizado."
        title="Tu portafolio todavia esta vacio"
      />
    );
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Accion</th>
            <th>Cantidad</th>
            <th>Reservadas</th>
            <th>Costo promedio</th>
            <th>Precio actual</th>
            <th>Valor</th>
            <th>P/L</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((position) => (
            <tr key={position.symbol}>
              <td data-label="Accion">{position.symbol}</td>
              <td data-label="Cantidad">{position.quantity}</td>
              <td data-label="Reservadas">{position.reservedQuantity}</td>
              <td data-label="Costo promedio">
                {formatCurrency(position.averageCost)}
              </td>
              <td data-label="Precio actual">
                {formatCurrency(position.marketPrice)}
              </td>
              <td data-label="Valor">{formatCurrency(position.marketValue)}</td>
              <td
                className={
                  position.unrealizedProfitLoss >= 0 ? 'text-positive' : 'text-negative'
                }
                data-label="P/L"
              >
                {formatCurrency(position.unrealizedProfitLoss)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
