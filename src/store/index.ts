// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { initialFetch, listenerMiddleware, moviesSlice } from './moviesSlice.ts';

// Create the store using your slice reducer
export const store = configureStore({
  reducer: {
    movies: moviesSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(listenerMiddleware.middleware),
});


// Dispatch initial fetch when store is created
store.dispatch(initialFetch());

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
