import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setForexRate } from '@/store/slices/currencySlice';
import { useForexRates } from '../api/hooks';

const STATIC_USDCLP_RATE = 950;

export function useForexRate() {
  const usdclpRate = useAppSelector((state) => state.currency.usdclpRate);

  return usdclpRate;
}

export function useForexDispatch() {
  const dispatch = useAppDispatch();
  const { data: rates } = useForexRates();

  const handleForexUpdate = useCallback((update: { symbol: string; close: number }) => {
    if (update.symbol === 'USDCLP' && update.close > 0) {
      dispatch(setForexRate(update.close));
    }
  }, [dispatch]);

  const fallbackRate = useCallback(() => {
    const wsRate = STATIC_USDCLP_RATE;
    console.error(
      '[ForexRate] WebSocket fallback — using static rate',
      wsRate,
    );
    dispatch(setForexRate(wsRate));
  }, [dispatch]);

  useEffect(() => {
    if (rates && rates.length > 0) {
      const usdclp = rates.find((r) => r.symbol === 'USDCLP');
      if (usdclp && usdclp.rate > 0) {
        dispatch(setForexRate(usdclp.rate));
      }
    }
  }, [rates, dispatch]);

  return { handleForexUpdate, fallbackRate };
}
