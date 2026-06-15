import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../../test/render';
import type { AdminConfig } from '../../../shared/api/validators';
import { ConfigEditModal } from './ConfigEditModal';

const { mutateAsyncMock } = vi.hoisted(() => ({
  mutateAsyncMock: vi.fn(),
}));

vi.mock('../../../shared/api/hooks', () => ({
  useUpdateAdminConfig: () => ({
    isPending: false,
    mutateAsync: mutateAsyncMock,
  }),
}));

function createConfig(value: AdminConfig['value']): AdminConfig {
  return {
    key: 'TEST_CONFIG',
    value,
    inUse: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

async function submitConfig(config: AdminConfig, nextValue: string) {
  const user = userEvent.setup();
  renderWithProviders(<ConfigEditModal config={config} onClose={vi.fn()} />);
  const valueControl = screen.getByLabelText('Valor');

  await act(async () => {
    if (valueControl instanceof HTMLSelectElement) {
      await user.selectOptions(valueControl, nextValue);
    } else {
      await user.clear(valueControl);
      await user.type(valueControl, nextValue);
    }
    await user.click(screen.getByRole('button', { name: 'Guardar' }));
  });
}

describe('ConfigEditModal', () => {
  beforeEach(() => {
    mutateAsyncMock.mockReset();
    mutateAsyncMock.mockResolvedValue({});
  });

  it('conserva valores booleanos como booleanos', async () => {
    await submitConfig(createConfig(true), 'false');

    expect(mutateAsyncMock).toHaveBeenCalledWith({
      key: 'TEST_CONFIG',
      data: { value: false },
    });
  });

  it('conserva valores numericos como numeros', async () => {
    await submitConfig(createConfig(10), '12.5');

    expect(mutateAsyncMock).toHaveBeenCalledWith({
      key: 'TEST_CONFIG',
      data: { value: 12.5 },
    });
  });

  it('conserva valores string como strings', async () => {
    await submitConfig(createConfig('original'), 'actualizado');

    expect(mutateAsyncMock).toHaveBeenCalledWith({
      key: 'TEST_CONFIG',
      data: { value: 'actualizado' },
    });
  });
});
