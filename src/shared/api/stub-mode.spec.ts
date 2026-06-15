import { describe, expect, it } from 'vitest';
import { resolveStubMode } from './stub-mode';

describe('resolveStubMode', () => {
  it('deshabilita stubs cuando no existe configuracion explicita', () => {
    expect(resolveStubMode()).toBe(false);
  });

  it('permite habilitar stubs explicitamente fuera de produccion', () => {
    expect(resolveStubMode({ viteValue: 'true' })).toBe(true);
  });

  it('deshabilita stubs en produccion aunque se soliciten explicitamente', () => {
    expect(resolveStubMode({ viteValue: 'true', isProduction: true })).toBe(false);
  });
});
