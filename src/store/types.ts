export interface Movie {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
  }
  
  export interface MovieDetail {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Actors: string;
    Plot: string;
    Poster: string;
    imdbRating: string;
    imdbID: string;
    Language: string;
    Type: string;
  }
  // Cache interface
  export interface CacheItem {
    data: any;
    timestamp: number;
    params?: string;
  }

  // Slice State
  export interface MoviesState {
    searchTerm: string;
    year: string;
    type: string;
    currentPage: number;
    itemsPerPage: number;
    movies: Movie[];
    totalResults: number;
    selectedMovie: MovieDetail | null;
    loading: boolean;
    error: string | null;
    cache: Record<string, CacheItem>;
    movieDetailCache: Record<string, CacheItem>;
  }