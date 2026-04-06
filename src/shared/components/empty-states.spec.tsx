import { describe, expect, it } from 'vitest';
import { EmptyState } from './EmptyState';
import { render, screen } from '@testing-library/react';

describe('EmptyState', () => {
  it('renderiza el titulo y descripcion correctamente', () => {
    render(
      <EmptyState
        title="Sin contenido"
        description="No hay elementos para mostrar"
      />
    );

    expect(screen.getByText('Sin contenido')).toBeInTheDocument();
    expect(screen.getByText('No hay elementos para mostrar')).toBeInTheDocument();
  });
});
