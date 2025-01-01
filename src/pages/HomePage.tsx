// HomePage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieList from '../components/MovieList';
import Pagination from '../components/Pagination';

interface Movie {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
}

const HomePage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('Pokemon');
    const [year, setYear] = useState<string>('');
    const [type, setType] = useState<string>(''); // 'movie', 'series', or 'episode'
    const [movies, setMovies] = useState<Movie[]>([]);
    const [totalResults, setTotalResults] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const itemsPerPage = 10;

    const fetchMovies = async (page: number = 1) => {
        try {
            const { data } = await axios.get('https://www.omdbapi.com/', {
                params: {
                    apikey: "621724f7",
                    s: searchTerm,
                    y: year || undefined,
                    type: type || undefined,
                    page,
                },
            });

            if (data.Response === 'True') {
                setMovies(data.Search);
                setTotalResults(parseInt(data.totalResults, 10));
            } else {
                setMovies([]);
                setTotalResults(0);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
        fetchMovies(1);
        // eslint-disable-next-line
    }, [searchTerm, year, type]);


    return (
        <div className="container my-4">
            <h1 className="mb-4">OMDb Search</h1>

            {/* Search Filters */}
            <div className="d-flex justify-content-center mt-4">
                <div className="row mb-3">
                    <div className="col-sm-4 mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by title"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="col-sm-3 mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Year (e.g. 2021)"
                            value={year}
                            onChange={e => setYear(e.target.value)}
                        />
                    </div>
                    <div className="col-sm-3 mb-2">
                        <select
                            className="form-select"
                            value={type}
                            onChange={e => setType(e.target.value)}
                        >
                            <option value="">All Types</option>
                            <option value="movie">Movie</option>
                            <option value="series">TV Series</option>
                            <option value="episode">Episode</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Movie List Table */}
            <MovieList movies={movies} />

            {/* Pagination */}
            {totalResults > itemsPerPage && (
                <div className="d-flex justify-content-center mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalResults={totalResults}
                        itemsPerPage={itemsPerPage}
                        onPageChange={(page) => {
                            setCurrentPage(page);
                            fetchMovies(page); // e.g. your function to update the movie list
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default HomePage;
