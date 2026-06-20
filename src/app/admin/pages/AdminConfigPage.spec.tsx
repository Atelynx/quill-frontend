import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../../test/render';
import { AdminConfigPage } from './AdminConfigPage';

const { refetchMock } = vi.hoisted(() => ({
  refetchMock: vi.fn(),
}));

vi.mock('../../../shared/api/hooks', () => ({
  useAdminConfigs: () => ({
    isError: true,
    isLoading: false,
    refetch: refetchMock,
  }),
}));

vi.mock('../components/ConfigEditModal', () => ({
  ConfigEditModal: () => null,
}));

vi.mock('../components/ConfigHistoryView', () => ({
  ConfigHistoryView: () => null,
}));

describe('AdminConfigPage', () => {
  it('muestra un error y permite reintentar sin simular configuraciones vacias', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminConfigPage />);

    expect(screen.getByText(/No fue posible cargar las configuraciones administrativas/)).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Reintentar' }));
    });

    expect(refetchMock).toHaveBeenCalledOnce();
  });
});
