import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../../test/render';
import { OrderForm } from './OrderForm';

const { postMock } = vi.hoisted(() => ({
  postMock: vi.fn(),
}));

vi.mock('../../../shared/api/http', () => ({
  apiClient: {
    post: postMock,
  },
}));

const quotes = [
  {
    symbol: 'AAPL',
    name: 'Apple',
    sector: 'Technology',
    currency: 'USD',
    currentPrice: 190.25,
    previousClose: 188.4,
    dayChangePercentage: 0.98,
  },
];

describe('OrderForm', () => {
  beforeEach(() => {
    postMock.mockReset();
  });

  it('bloquea el envio cuando la cantidad o el precio limite son invalidos', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <OrderForm quotes={quotes} selectedSymbol={quotes[0].symbol} />,
    );

    await user.clear(screen.getByLabelText('Cantidad'));
    await user.type(screen.getByLabelText('Cantidad'), '0');
    await user.clear(screen.getByLabelText('Precio limite'));
    await user.type(screen.getByLabelText('Precio limite'), '0');
    await user.click(screen.getByRole('button', { name: 'Crear orden' }));

    await waitFor(() => {
      expect(postMock).not.toHaveBeenCalled();
    });
  });

  it('envia la orden valida y muestra confirmacion', async () => {
    const user = userEvent.setup();
    postMock.mockResolvedValue({
      data: {
        id: 'order-1',
      },
    });

    renderWithProviders(
      <OrderForm quotes={quotes} selectedSymbol={quotes[0].symbol} />,
    );

    await user.clear(screen.getByLabelText('Cantidad'));
    await user.type(screen.getByLabelText('Cantidad'), '3');
    await user.clear(screen.getByLabelText('Precio limite'));
    await user.type(screen.getByLabelText('Precio limite'), '189.5');
    await user.click(screen.getByRole('button', { name: 'Crear orden' }));

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith('/orders', {
        symbol: 'AAPL',
        side: 'BUY',
        quantity: 3,
        limitPrice: 189.5,
      });
    });
    expect(
      await screen.findByText(
        'Orden registrada. Quedara pendiente hasta que el mercado cumpla la condicion.',
      ),
    ).toBeInTheDocument();
  });
});
