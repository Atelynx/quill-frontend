import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

function createMatchMedia() {
  return vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

function installMatchMedia() {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: createMatchMedia(),
  });
}

vi.stubEnv('VITE_USE_STUBS', 'false');
installMatchMedia();

beforeEach(() => {
  installMatchMedia();
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.style.colorScheme = '';
  vi.restoreAllMocks();
});
