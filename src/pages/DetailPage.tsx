// DetailPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

interface MovieDetail {
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
}

const DetailPage: React.FC = () => {
    const { imdbID } = useParams();
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const navigate = useNavigate();

    const fetchMovieDetail = async () => {
        try {
            const { data } = await axios.get('https://www.omdbapi.com/', {
                params: { apikey: "621724f7", i: imdbID, plot: 'full' },
            });
            setMovie(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (imdbID) {
            fetchMovieDetail();
        }
    }, [imdbID]);

    if (!movie) {
        return (
            <div className="container my-4">
                <p>Loading...</p>
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
                        src={movie.Poster}
                        alt={movie.Title}
                        className="img-fluid rounded"
                    />
                </div>
                <div className="col-md-8">
                    <h2>{movie.Title}</h2>
                    <p className="mb-1"><strong>Year:</strong> {movie.Year}</p>
                    <p className="mb-1"><strong>Runtime:</strong> {movie.Runtime}</p>
                    <p className="mb-1"><strong>Genre:</strong> {movie.Genre}</p>
                    <p className="mb-1"><strong>Director:</strong> {movie.Director}</p>
                    <p className="mb-1"><strong>Actors:</strong> {movie.Actors}</p>
                    <p className="mb-3"><strong>IMDb Rating:</strong> {movie.imdbRating}</p>
                    <p><strong>Plot:</strong> {movie.Plot}</p>
                </div>
            </div>
        </div>
    );
};

export default DetailPage;
