import { configureStore } from '@reduxjs/toolkit';
import { authSlice, babySlice } from './features';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    baby: babySlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
