import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OrdersTable } from '../../modules/orders/components/OrdersTable';
import { PortfolioTable } from '../../modules/portfolio/components/PortfolioTable';
import { TradesTable } from '../../modules/trades/components/TradesTable';

describe('Dashboard empty states', () => {
  it('muestra mensajes utiles cuando no hay datos de usuario', () => {
    render(
      <>
        <OrdersTable orders={[]} />
        <PortfolioTable positions={[]} />
        <TradesTable trades={[]} />
      </>,
    );

    expect(
      screen.getByText('Todavia no hay ordenes abiertas'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Tu portafolio todavia esta vacio'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Aun no hay operaciones ejecutadas'),
    ).toBeInTheDocument();
  });
});
