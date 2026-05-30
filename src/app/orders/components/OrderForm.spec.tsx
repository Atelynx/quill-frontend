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
    close: 190.25,
    open: 189.8,
    high: 191.1,
    low: 189.2,
    previousClose: 188.4,
    dayChangePercentage: 0.98,
    source: 'test',
    volume: 1_000_000,
    lastMarketDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

describe('OrderForm', () => {
  beforeEach(() => {
    postMock.mockReset();
  });

  it('bloquea el envio cuando la cantidad o el precio limite son invalidos', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <OrderForm quotes={quotes} rate={950} selectedSymbol={quotes[0].symbol} />,
    );

    await user.clear(screen.getByLabelText('Cantidad'));
    await user.type(screen.getByLabelText('Cantidad'), '0');
    await user.clear(screen.getByLabelText(/Precio limite/));
    await user.type(screen.getByLabelText(/Precio limite/), '0');
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
      <OrderForm quotes={quotes} rate={950} selectedSymbol={quotes[0].symbol} />,
    );

    await user.clear(screen.getByLabelText('Cantidad'));
    await user.type(screen.getByLabelText('Cantidad'), '3');
    await user.clear(screen.getByLabelText(/Precio limite/));
    await user.type(screen.getByLabelText(/Precio limite/), '189.5');
    await user.click(screen.getByRole('button', { name: 'Crear orden' }));

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith('/orders', {
        symbol: 'AAPL',
        side: 'BUY',
        type: 'LIMIT',
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

  it('alterna entre modo cantidad y modo monto', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <OrderForm quotes={quotes} rate={950} selectedSymbol={quotes[0].symbol} />,
    );

    expect(screen.getByLabelText('Cantidad')).toBeInTheDocument();
    expect(screen.queryByLabelText('Monto a invertir (CLP)')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Por monto' }));
    expect(screen.queryByLabelText('Cantidad')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Monto a invertir (CLP)')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Por cantidad' }));
    expect(screen.getByLabelText('Cantidad')).toBeInTheDocument();
    expect(screen.queryByLabelText('Monto a invertir (CLP)')).not.toBeInTheDocument();
  });

  it('muestra preview de acciones calculadas en modo monto', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <OrderForm quotes={quotes} rate={950} selectedSymbol={quotes[0].symbol} />,
    );

    await user.click(screen.getByRole('button', { name: 'Por monto' }));
    await user.clear(screen.getByLabelText(/Precio limite/));
    await user.type(screen.getByLabelText(/Precio limite/), '1000');
    await user.type(screen.getByLabelText('Monto a invertir (CLP)'), '500000');

    expect(await screen.findByText(/Costo estimado/i)).toBeInTheDocument();
  });

  it('muestra advertencia cuando el monto es insuficiente para 1 accion', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <OrderForm quotes={quotes} rate={950} selectedSymbol={quotes[0].symbol} />,
    );

    await user.click(screen.getByRole('button', { name: 'Por monto' }));
    await user.clear(screen.getByLabelText(/Precio limite/));
    await user.type(screen.getByLabelText(/Precio limite/), '1000');
    await user.type(screen.getByLabelText('Monto a invertir (CLP)'), '500');

    expect(await screen.findByText(/Monto insuficiente/i)).toBeInTheDocument();
  });

  it('calcula cantidad desde el monto y envia la orden correcta en modo monto', async () => {
    const user = userEvent.setup();
    postMock.mockResolvedValue({ data: { id: 'order-1' } });

    renderWithProviders(
      <OrderForm quotes={quotes} rate={950} selectedSymbol={quotes[0].symbol} />,
    );

    await user.click(screen.getByRole('button', { name: 'Por monto' }));
    await user.clear(screen.getByLabelText(/Precio limite/));
    await user.type(screen.getByLabelText(/Precio limite/), '1000');
    await user.type(screen.getByLabelText('Monto a invertir (CLP)'), '500000');
    await user.click(screen.getByRole('button', { name: 'Crear orden' }));

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith('/orders', {
        symbol: 'AAPL',
        side: 'BUY',
        type: 'LIMIT',
        quantity: 500,
        limitPrice: 1000,
      });
    });
  });

  it('bloquea el envio en modo monto cuando el monto es insuficiente', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <OrderForm quotes={quotes} rate={950} selectedSymbol={quotes[0].symbol} />,
    );

    await user.click(screen.getByRole('button', { name: 'Por monto' }));
    await user.clear(screen.getByLabelText(/Precio limite/));
    await user.type(screen.getByLabelText(/Precio limite/), '1000');
    await user.type(screen.getByLabelText('Monto a invertir (CLP)'), '500');
    await user.click(screen.getByRole('button', { name: 'Crear orden' }));

    await waitFor(() => {
      expect(postMock).not.toHaveBeenCalled();
    });
  });
});
