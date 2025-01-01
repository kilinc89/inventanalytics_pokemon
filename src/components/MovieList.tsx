import { FC } from 'react';
import { Link } from 'react-router-dom';
import './MovieList.scss';

interface Movie {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
}

interface MovieListProps {
    movies: Movie[];
}

const MovieList: FC<MovieListProps> = ({ movies }) => {
    return (
        <div className="movie-grid">
            {movies.map((movie) => (
                <div key={movie.imdbID} className="movie-card">
                    <div className="movie-poster">
                        <img
                            src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.png'}
                            alt={movie.Title}
                        />
                    </div>
                    <div className="movie-info">
                        <h3 className="movie-title" title={movie.Title}>
                            {movie.Title}
                        </h3>
                        <div className="movie-meta">
                            <span className="movie-type">{movie.Type}</span>
                            <span className="movie-year">{movie.Year}</span>
                        </div>
                        <Link to={`/detail/${movie.imdbID}`} className="view-details">
                            View Details
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MovieList;