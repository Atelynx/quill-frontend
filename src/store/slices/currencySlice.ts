import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type Currency = 'CLP' | 'USD';

interface CurrencyState {
  preferredCurrency: Currency;
  usdclpRate: number;
}

const storedCurrency = localStorage.getItem('currency') as Currency | null;
const parsedRate = Number(localStorage.getItem('usdclp-rate')) || 950;

const initialState: CurrencyState = {
  preferredCurrency: storedCurrency === 'USD' ? 'USD' : 'CLP',
  usdclpRate: parsedRate,
};

export const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<Currency>) => {
      state.preferredCurrency = action.payload;
      localStorage.setItem('currency', action.payload);
    },
    setForexRate: (state, action: PayloadAction<number>) => {
      if (action.payload > 0) {
        state.usdclpRate = action.payload;
        localStorage.setItem('usdclp-rate', String(action.payload));
      }
    },
  },
});

export const { setCurrency, setForexRate } = currencySlice.actions;
export default currencySlice.reducer;
