export const button = {
  base: 'inline-flex items-center justify-center gap-[0.6rem] min-h-[46px] px-5 py-3.5 rounded-full transition-all duration-[var(--main-page-transition)]',
  primary: 'bg-[var(--gradient-primary-button)] text-white shadow-[0_12px_24px_var(--main-page-accent-shadow)] hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2 disabled:cursor-wait disabled:opacity-[0.72] disabled:transform-none',
  secondary: 'bg-[var(--gradient-secondary-button)] text-[var(--color-text)] border border-[var(--main-page-border)] shadow-[var(--main-page-shadow-soft)] hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2 disabled:cursor-wait disabled:opacity-[0.72] disabled:transform-none',
  themeToggle: 'bg-[var(--gradient-secondary-button)] text-[var(--color-text)] border border-[var(--main-page-border)] shadow-[var(--main-page-shadow-soft)] hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2',
}

export const surface = {
  xl: 'rounded-[var(--main-page-radius-xl)] shadow-[var(--main-page-shadow)] border border-[var(--main-page-border)] backdrop-blur-xl',
  lg: 'rounded-[var(--main-page-radius-lg)] shadow-[var(--main-page-shadow)] border border-[var(--main-page-border)] backdrop-blur-xl',
  md: 'rounded-[var(--main-page-radius-md)] shadow-[var(--main-page-shadow-soft)] border border-[var(--main-page-border)]',
}

export const gradient = {
  hero: 'bg-[var(--gradient-hero)]',
  card: 'bg-[var(--gradient-card-surface)]',
  tabActive: 'bg-[var(--gradient-tab-active)]',
  tabInactive: 'bg-[var(--gradient-tab-inactive)]',
  metricCard: 'bg-[var(--gradient-metric-surface)]',
}
