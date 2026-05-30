export const USE_STUBS =
  String(import.meta.env.VITE_USE_STUBS ?? import.meta.env.USE_STUBS ?? 'false').toLowerCase() ===
  'true';

export function isStubMode() {
  return USE_STUBS;
}
