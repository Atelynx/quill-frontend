interface StubModeOptions {
  viteValue?: unknown;
  legacyValue?: unknown;
  isProduction?: boolean;
}

export function resolveStubMode({
  viteValue,
  legacyValue,
  isProduction = false,
}: StubModeOptions = {}) {
  if (isProduction) return false;

  return String(viteValue ?? legacyValue ?? 'false').toLowerCase() === 'true';
}

export const USE_STUBS = resolveStubMode({
  viteValue: import.meta.env.VITE_USE_STUBS,
  legacyValue: import.meta.env.USE_STUBS,
  isProduction: import.meta.env.PROD,
});

export function isStubMode() {
  return USE_STUBS;
}
