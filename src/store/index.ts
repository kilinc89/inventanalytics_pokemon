// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { moviesSlice } from './moviesSlice.ts';

// Create the store using your slice reducer
export const store = configureStore({
  reducer: {
    movies: moviesSlice.reducer,
  },
});

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
