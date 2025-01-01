// store/moviesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Movie, MovieDetail, MoviesState } from './types';
import { RootState } from './index';

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
};

const API_KEY = '621724f7';

// Thunk to fetch search results
export const fetchMovies = createAsyncThunk<
  // Returned data shape
  { Search: Movie[]; totalResults: string },
  // Argument shape
  { page?: number},
  // ThunkAPI types
  { rejectValue: string }
>('movies/fetchMovies', async (args, thunkAPI) => {
  const state = thunkAPI.getState() as RootState; 
  const { movies } = state;
  try {
    const { data } = await axios.get('https://www.omdbapi.com/', {
      params: {
        apikey: API_KEY, 
        s: movies.searchTerm,
        y: movies.year || undefined,
        type: movies.type || undefined,
        page: args.page || movies.currentPage,
      },
    });
    if (data.Response === 'False') {
      return thunkAPI.rejectWithValue(data.Error || 'No results.');
    }
    return {
      Search: data.Search,
      totalResults: data.totalResults,
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
  { imdbID: string},
  { rejectValue: string }
>('movies/fetchMovieDetail', async (args, thunkAPI) => {
  try {
    const { data } = await axios.get('https://www.omdbapi.com/', {
      params: {
        apikey: API_KEY, 
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

export const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    // For updating local search/filter in Redux
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
  },
  extraReducers: (builder) => {
    // fetchMovies
    builder.addCase(fetchMovies.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMovies.fulfilled, (state, action) => {
      state.loading = false;
      state.movies = action.payload.Search;
      state.totalResults = parseInt(action.payload.totalResults, 10) || 0;
    });
    builder.addCase(fetchMovies.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Something went wrong fetching movies.';
    });

    // fetchMovieDetail
    builder.addCase(fetchMovieDetail.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMovieDetail.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedMovie = action.payload;
    });
    builder.addCase(fetchMovieDetail.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload || 'Something went wrong fetching movie detail.';
    });
  },
});

// Export the action creators
export const {
  setSearchTerm,
  setYear,
  setType,
  setCurrentPage,
  resetSelectedMovie,
} = moviesSlice.actions;
