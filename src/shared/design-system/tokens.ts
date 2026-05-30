export const cssVars = {
  color: {
    background: '--color-background',
    primary: '--color-primary',
    secondary: '--color-secondary',
    accent: '--color-accent',
    text: '--color-text',
  },
  surface: {
    surface: '--main-page-surface',
    soft: '--main-page-surface-soft',
    muted: '--main-page-surface-muted',
    strong: '--main-page-surface-strong',
  },
  border: {
    default: '--main-page-border',
    strong: '--main-page-border-strong',
  },
  text: {
    soft: '--main-page-text-soft',
    muted: '--main-page-text-muted',
  },
  accent: {
    strong: '--main-page-accent-strong',
    soft: '--main-page-accent-soft',
  },
  semantic: {
    danger: '--main-page-danger',
    dangerSoft: '--main-page-danger-soft',
    warning: '--main-page-warning',
  },
  inverse: {
    surface: '--main-page-inverse-surface',
    surfaceStrong: '--main-page-inverse-surface-strong',
    border: '--main-page-inverse-border',
    textSoft: '--main-page-inverse-text-soft',
    textMuted: '--main-page-inverse-text-muted',
  },
  shadow: {
    default: '--main-page-shadow',
    soft: '--main-page-shadow-soft',
  },
  radius: {
    xl: '--main-page-radius-xl',
    lg: '--main-page-radius-lg',
    md: '--main-page-radius-md',
  },
  transition: {
    default: '--main-page-transition',
  },
} as const;

export const radii = {
  card: '28px',
  cardLg: '22px',
  cardMd: '16px',
} as const;

export const shadows = {
  card: '0 22px 52px color-mix(in srgb, var(--color-text) 10%, transparent)',
  cardSoft: '0 14px 34px color-mix(in srgb, var(--color-text) 8%, transparent)',
} as const;

export const transitions = {
  fast: '180ms ease',
} as const;

export type DesignRadius = keyof typeof radii;
export type DesignShadow = keyof typeof shadows;
export type DesignTransition = keyof typeof transitions;
