import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    setSearchTerm,
    setYear,
    setType,
    setCurrentPage,
} from '../store/moviesSlice';
import MovieList from '../components/MovieList';
import Pagination from '../components/Pagination';

const HomePage = () => {
    const dispatch = useAppDispatch();

    const {
        searchTerm,
        year,
        type,
        movies,
        totalResults,
        currentPage,
        itemsPerPage,
        loading,
    } = useAppSelector((state) => state.movies);


    const handlePageChange = (page: number) => {
        //on page change scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        // Update the currentPage in the store
        dispatch(setCurrentPage(page));
    };

    return (
        <div className="container my-4">
            <h1 className="mb-4">OMDb Search</h1>

            <div className="d-flex justify-content-center mt-4">
                <div className="row mb-3">
                    <div className="col-sm-4 mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by title"
                            value={searchTerm}
                            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                        />
                    </div>
                    <div className="col-sm-3 mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Year"
                            value={year}
                            onChange={(e) => dispatch(setYear(e.target.value))}
                        />
                    </div>
                    <div className="col-sm-3 mb-2">
                        <select
                            className="form-select"
                            value={type}
                            onChange={(e) => dispatch(setType(e.target.value))}
                        >
                            <option value="">All Types</option>
                            <option value="movie">Movie</option>
                            <option value="series">TV Series</option>
                            <option value="episode">Episode</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Loading / Error handling */}
            {loading && <p>Loading...</p>}

            {/* Movie List */}
            <MovieList movies={movies} />

            {/* Pagination */}
            {totalResults > itemsPerPage && !loading && (
                <div className="d-flex justify-content-center mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalResults={totalResults}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default HomePage;
