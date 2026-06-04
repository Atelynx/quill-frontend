const stubModeValue = String(
  import.meta.env.VITE_USE_STUBS ?? import.meta.env.USE_STUBS ?? 'false',
).toLowerCase() === 'true';

export const USE_STUBS = stubModeValue;

export function isStubMode() {
  return USE_STUBS;
}