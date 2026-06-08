import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCurrency } from '@/store/slices/currencySlice';
import { currencySelector } from '@/shared/content/strings';
import { button } from '@/shared/design-system/surfaces';
import type { Currency } from '@/store/slices/currencySlice';

const currencies: { value: Currency; label: string }[] = [
  { value: 'CLP', label: 'CLP' },
  { value: 'USD', label: 'USD' },
];

export function CurrencySelector() {
  const dispatch = useAppDispatch();
  const { preferredCurrency } = useAppSelector((state) => state.currency);

  const cycleCurrency = () => {
    const currentIndex = currencies.findIndex(
      (c) => c.value === preferredCurrency,
    );
    const nextIndex = (currentIndex + 1) % currencies.length;
    dispatch(setCurrency(currencies[nextIndex].value));
  };

  return (
    <button
      className={button.themeToggle}
      onClick={cycleCurrency}
      type="button"
      aria-label={currencySelector.ariaLabel(preferredCurrency)}
    >
      <span>{preferredCurrency}</span>
    </button>
  );
}
