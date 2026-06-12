import { useState, useEffect } from 'react';

export interface MarketCountdown {
  state: 'before-open' | 'open' | 'after-close';
  hours: number;
  minutes: number;
  seconds: number;
  progress: number;
}

function toSeconds(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 3600 + m * 60;
}

export function useMarketCountdown(
  openTime: string,
  closeTime: string,
): MarketCountdown | null {
  const [countdown, setCountdown] = useState<MarketCountdown | null>(null);

  useEffect(() => {
    if (!openTime || !closeTime) return;

    const tick = () => {
      const now = new Date();
      const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      const openSec = toSeconds(openTime);
      const closeSec = toSeconds(closeTime);

      let state: MarketCountdown['state'];
      let targetSec: number;
      let progress: number;

      if (nowSec < openSec) {
        state = 'before-open';
        targetSec = openSec;
        progress = 0;
      } else if (nowSec < closeSec) {
        state = 'open';
        targetSec = closeSec;
        progress = (nowSec - openSec) / (closeSec - openSec);
      } else {
        state = 'after-close';
        targetSec = openSec + 86400;
        progress = 1;
      }

      const remaining = Math.max(0, targetSec - nowSec);
      const hours = Math.floor(remaining / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      const seconds = remaining % 60;

      setCountdown({ state, hours, minutes, seconds, progress });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [openTime, closeTime]);

  return countdown;
}
