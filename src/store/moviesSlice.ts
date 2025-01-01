// store/moviesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction, createListenerMiddleware } from '@reduxjs/toolkit';
import axios from 'axios';
import { Movie, MovieDetail, MoviesState } from './types';
import { AppDispatch, RootState } from './index';



// Initial State
const initialState: MoviesState = {
  searchTerm: 'Pokemon',
  year: '',
  type: '',
  currentPage: 1,
  itemsPerPage: 10,
  movies: [],
  totalResults: 0,
  selectedMovie: null,
  loading: false,
  error: null,
  cache: {},
  movieDetailCache: {}
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const API_URL = `https://www.omdbapi.com/?apikey=621724f7`;

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
  predicate: (_action, currentState, previousState) => {
    return currentState.movies.searchTerm !== previousState.movies.searchTerm ||
      currentState.movies.currentPage !== previousState.movies.currentPage ||
      ((currentState.movies.year.length == 4 || currentState.movies.year.length == 0) && currentState.movies.year !== previousState.movies.year) ||
      currentState.movies.type !== previousState.movies.type;
  },
  effect: async (_action, listenerApi) => {
    listenerApi.cancelActiveListeners();
    await listenerApi.delay(500);
    const response = await fetchMovies({});
    listenerApi.dispatch(response);
  },
});

// Thunk to fetch search results
export const fetchMovies = createAsyncThunk<
  { Search: Movie[]; totalResults: string; params: string },
  { page?: number },
  { rejectValue: string }
>('movies/fetchMovies', async (args, thunkAPI) => {
  const state = thunkAPI.getState() as RootState; 
  const { movies } = state;
  const params = JSON.stringify({ searchTerm: movies.searchTerm, year: movies.year, type: movies.type, page: args.page || movies.currentPage });

  // Check cache
  const cachedData = movies.cache[params];
  const now = Date.now();
  if (cachedData && (now - cachedData.timestamp) < CACHE_DURATION) {
    return cachedData.data;
  }

  try {
    const { data } = await axios.get(API_URL, {
      params: {
        s: movies.searchTerm,
        ...(movies.year.length === 4 && { y: movies.year }),
        ...(movies.type && { type: movies.type }),
        page: args.page || movies.currentPage,
      },
    });
    if (data.Response === 'False') {
      return thunkAPI.rejectWithValue(data.Error || 'No results.');
    }
    return {
      Search: data.Search,
      totalResults: data.totalResults,
      params
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message);
    }
    return thunkAPI.rejectWithValue('An unknown error occurred');
  }
});

// Thunk to fetch movie detail by IMDb ID
export const fetchMovieDetail = createAsyncThunk<
  MovieDetail,
  { imdbID: string },
  { rejectValue: string }
>('movies/fetchMovieDetail', async (args, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  const { movieDetailCache } = state.movies;

  // Check cache
  const cachedData = movieDetailCache[args.imdbID];
  const now = Date.now();
  if (cachedData && (now - cachedData.timestamp) < CACHE_DURATION) {
    return cachedData.data;
  }

  try {
    const { data } = await axios.get(API_URL, {
      params: {
        i: args.imdbID,
        plot: 'full',
      },
    });
    if (data.Response === 'False') {
      return thunkAPI.rejectWithValue(data.Error || 'Movie not found.');
    }
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message);
    }
    return thunkAPI.rejectWithValue('An unknown error occurred');
  }
});

export const initialFetch = createAsyncThunk(
  'movies/initialFetch',
  async (_, thunkAPI) => {
    try {
      await thunkAPI.dispatch(fetchMovies({ page: 1 }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue('An unknown error occurred');
    }
  }
);

export const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    setYear(state, action: PayloadAction<string>) {
      state.year = action.payload;
    },
    setType(state, action: PayloadAction<string>) {
      state.type = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    resetSelectedMovie(state) {
      state.selectedMovie = null;
    },
    clearCache(state) {
      state.cache = {};
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMovies.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMovies.fulfilled, (state, action) => {
      state.loading = false;
      state.movies = action.payload.Search;
      state.totalResults = parseInt(action.payload.totalResults, 10) || 0;
      state.cache[action.payload.params] = {
        data: {
          Search: action.payload.Search,
          totalResults: action.payload.totalResults
        },
        timestamp: Date.now(),
        params: action.payload.params
      };
    });
    builder.addCase(fetchMovies.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Something went wrong fetching movies.';
    });
    builder.addCase(fetchMovieDetail.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMovieDetail.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedMovie = action.payload;
      state.movieDetailCache[action.meta.arg.imdbID] = {
        data: action.payload,
        timestamp: Date.now()
      };
    });
    builder.addCase(fetchMovieDetail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Something went wrong fetching movie detail.';
    });
  },
});

export const {
  setSearchTerm,
  setYear,
  setType,
  setCurrentPage,
  resetSelectedMovie,
  clearCache
} = moviesSlice.actions;

export default moviesSlice.reducer;



