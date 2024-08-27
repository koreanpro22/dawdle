import { configureStore } from '@reduxjs/toolkit';
import globalEventReducer from './slices/globalEventSlice';

export const store = configureStore({
  reducer: {
    globalEvent: globalEventReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
