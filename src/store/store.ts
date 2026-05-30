// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import accessibilityReducer from './slices/accessibilitySlice';
import currencyReducer from './slices/currencySlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    accessibility: accessibilityReducer,
    currency: currencyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;