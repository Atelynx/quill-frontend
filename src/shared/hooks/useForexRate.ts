import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setForexRate } from '@/store/slices/currencySlice';

const STATIC_USDCLP_RATE = 950;

export function useForexRate() {
  const usdclpRate = useAppSelector((state) => state.currency.usdclpRate);
  return usdclpRate;
}

export function useForexDispatch() {
  const dispatch = useAppDispatch();

  const handleForexUpdate = (update: { symbol: string; close: number }) => {
    if (update.symbol === 'USDCLP' && update.close > 0) {
      dispatch(setForexRate(update.close));
    }
  };

  const fallbackRate = () => {
    console.error(
      '[ForexRate] WebSocket fallback — using static rate',
      STATIC_USDCLP_RATE,
    );
    dispatch(setForexRate(STATIC_USDCLP_RATE));
  };

  return { handleForexUpdate, fallbackRate };
}
