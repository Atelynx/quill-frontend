import NumberFlow from '@number-flow/react';
import type { MarketStatus } from '../../../shared/api/validators';
import { dashboard } from '../../../shared/content/strings';
import { useMarketCountdown } from '../../../shared/hooks/useMarketCountdown';

interface MarketStatusBadgeProps {
  status: MarketStatus | undefined;
}

const dotBase = 'inline-block h-2 w-2 rounded-full';

const container =
  'flex flex-col gap-1 rounded-[var(--main-page-radius-md)] border px-4 py-2.5 text-[0.85rem] leading-tight';

export function MarketStatusBadge({ status }: MarketStatusBadgeProps) {
  const countdown = useMarketCountdown(
    status?.openTime ?? '',
    status?.closeTime ?? '',
  );

  if (!status) {
    return (
      <span
        className={container}
        style={{
          background: 'var(--main-page-surface-muted)',
          borderColor: 'var(--main-page-border)',
          color: 'var(--main-page-text-soft)',
        }}
      >
        Estado no confirmado
      </span>
    );
  }

  const isOpen = status.open;
  const accentColor = isOpen ? 'var(--color-accent)' : '#b53a26';
  const bgColor = isOpen
    ? 'color-mix(in srgb, var(--color-accent) 10%, transparent)'
    : 'color-mix(in srgb, #b53a26 12%, transparent)';
  const borderColor = isOpen
    ? 'color-mix(in srgb, var(--color-accent) 25%, transparent)'
    : 'color-mix(in srgb, #b53a26 25%, transparent)';

  const label = isOpen ? dashboard.marketStatus.open : dashboard.marketStatus.closed;
  const countdownLabel =
    countdown?.state === 'open'
      ? dashboard.marketStatus.closesIn
      : dashboard.marketStatus.opensIn;

  return (
    <div
      className={container}
      style={{
        background: bgColor,
        borderColor,
        color: accentColor,
      }}
    >
      <div className="flex items-center gap-2">
        <span className={dotBase} style={{ background: accentColor }} />
        <strong>{label}</strong>
        <span style={{ opacity: 0.7, fontWeight: 400, marginLeft: 'auto' }}>
          {status.openTime} → {status.closeTime}
        </span>
      </div>

      {countdown ? (
        <div className="flex items-center gap-1.5" style={{ opacity: 0.85 }}>
          <span>{countdownLabel}</span>
          <span className="flex items-center gap-0.5 font-semibold tabular-nums">
            <NumberFlow
              value={countdown.hours}
              format={{ minimumIntegerDigits: 2 }}
              locales="es-CL"
              trend={-1}
            />
            <span>h</span>
            <NumberFlow
              value={countdown.minutes}
              format={{ minimumIntegerDigits: 2 }}
              locales="es-CL"
              trend={-1}
            />
            <span>m</span>
            <NumberFlow
              value={countdown.seconds}
              format={{ minimumIntegerDigits: 2 }}
              locales="es-CL"
              trend={-1}
            />
            <span>s</span>
          </span>
        </div>
      ) : null}
    </div>
  );
}
