import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../../test/render';
import { TradesTable } from './TradesTable';

describe('TradesTable', () => {
  it('muestra un estado vacío cuando no recibe operaciones', () => {
    renderWithProviders(
      <TradesTable currency="CLP" rate={950} trades={undefined} />,
    );

    expect(
      screen.getByText('Aun no hay operaciones ejecutadas'),
    ).toBeInTheDocument();
  });

  it('muestra un estado controlado cuando falla la query', () => {
    renderWithProviders(
      <TradesTable currency="CLP" hasError rate={950} />,
    );

    expect(screen.getByText('Operaciones no disponibles')).toBeInTheDocument();
  });
});
