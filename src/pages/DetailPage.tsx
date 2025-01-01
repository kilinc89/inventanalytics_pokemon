import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMovieDetail, resetSelectedMovie } from '../store/moviesSlice';



const DetailPage: React.FC = () => {
    const { imdbID } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // Access the selected movie & loading state from Redux
    const { selectedMovie, loading, error } = useAppSelector((state) => state.movies);

    useEffect(() => {
        if (imdbID) {
            dispatch(fetchMovieDetail({ imdbID }));
        }
        return () => {
            // Optional: clear out selectedMovie when unmounting
            dispatch(resetSelectedMovie());
        };
    }, [imdbID, dispatch]);

    if (loading) {
        return (
            <div className="container my-4">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container my-4">
                <p>Error: {error}</p>
            </div>
        );
    }

    if (!selectedMovie) {
        return (
            <div className="container my-4">
                <p>No movie found.</p>
            </div>
        );
    }

    return (
        <div className="container my-4">
            <button
                className="btn btn-primary mb-4"
                onClick={() => navigate(-1)}
            >
                <FaArrowLeft className="mx-1" />
                Back
            </button>
            <div className="row">
                <div className="col-md-4">
                    <img
                        src={selectedMovie.Poster}
                        alt={selectedMovie.Title}
                        className="img-fluid rounded"
                    />
                </div>
                <div className="col-md-8">
                    <h2>{selectedMovie.Title}</h2>
                    <p className="mb-1"><strong>Year:</strong> {selectedMovie.Year}</p>
                    <p className="mb-1"><strong>Runtime:</strong> {selectedMovie.Runtime}</p>
                    <p className="mb-1"><strong>Genre:</strong> {selectedMovie.Genre}</p>
                    <p className="mb-1"><strong>Director:</strong> {selectedMovie.Director}</p>
                    <p className="mb-1"><strong>Actors:</strong> {selectedMovie.Actors}</p>
                    <p className="mb-3"><strong>IMDb Rating:</strong> {selectedMovie.imdbRating}</p>
                    <p><strong>Plot:</strong> {selectedMovie.Plot}</p>
                </div>
            </div>
        </div>
    );
};

export default DetailPage;
