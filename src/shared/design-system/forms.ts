import { surface } from './surfaces'

export const inputBase = `w-full min-h-[48px] px-4 py-3.5 ${surface.md} bg-[var(--main-page-surface)] text-[var(--color-text)] shadow-[inset_0_1px_0_var(--main-page-input-inset)] placeholder:text-[var(--main-page-text-muted)] focus-visible:border-[var(--color-accent)] focus-visible:shadow-[0_0_0_4px_var(--main-page-accent-soft),_inset_0_1px_0_var(--main-page-input-inset)] focus-visible:outline-none`

export const messageBase = 'rounded-[var(--main-page-radius-md)] px-4 py-3.5 animate-[fade-slide_240ms_ease]'

export const successMessage = `${messageBase} text-[var(--main-page-accent-strong)] bg-[var(--main-page-accent-soft)] border border-[color-mix(in_srgb,_var(--color-accent)_22%,_transparent)]`

export const errorMessage = `${messageBase} text-[var(--main-page-danger)] bg-[var(--main-page-danger-soft)] border border-[rgba(181,58,38,0.24)]`
