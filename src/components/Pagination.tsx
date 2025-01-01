import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationProps {
    currentPage: number;
    totalResults: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalResults,
    itemsPerPage,
    onPageChange
}) => {
    // Decide how many page numbers to display in one chunk
    const PAGES_TO_SHOW = 5;

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalResults / itemsPerPage);
    if (totalPages <= 1) return null; // No need for pagination

    /**
     * Figure out which chunk we're currently in, based on currentPage.
     * If currentPage=7 and PAGES_TO_SHOW=5, for example:
     *   chunkIndex = floor((7-1)/5) = floor(6/5) = 1 (the "second chunk")
     */
    const currentChunkIndex = Math.floor((currentPage - 1) / PAGES_TO_SHOW);

    // The first page in the current chunk
    const chunkStart = currentChunkIndex * PAGES_TO_SHOW + 1;
    // The last page in the current chunk (may not actually be 5 if near the end)
    const chunkEnd = Math.min(chunkStart + PAGES_TO_SHOW - 1, totalPages);

    // Create an array of page numbers for this chunk
    const chunkPages = Array.from(
        { length: chunkEnd - chunkStart + 1 },
        (_, i) => chunkStart + i
    );

    // Determine if there's a previous chunk and a next chunk
    const hasPrevChunk = chunkStart > 1;                 // chunkStart would be at least 6 if there's a previous chunk
    const hasNextChunk = chunkEnd < totalPages;          // chunkEnd < totalPages means there's another chunk ahead

    // Handlers for skipping to previous or next chunk
    const handlePrevChunk = () => {
        // Jump back 1 chunk
        const newPage = chunkStart - PAGES_TO_SHOW;
        // If that goes below 1, just jump to page 1
        onPageChange(newPage < 1 ? 1 : newPage);
    };

    const handleNextChunk = () => {
        // Jump forward 1 chunk
        const newPage = chunkEnd + 1;
        // If that goes beyond totalPages, just jump to last page
        onPageChange(newPage > totalPages ? totalPages : newPage);
    };

    // Handlers for single-page previous/next
    const handlePrevPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <nav aria-label="Page navigation" className="mt-3">
            <ul className="pagination pagination-sm">

                {/* Previous chunk button (optional) */}
                {hasPrevChunk && (
                    <li className="page-item">
                        <button className="page-link" onClick={handlePrevChunk}>
                            « Prev 5
                        </button>
                    </li>
                )}

                {/* Single-page Previous */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={handlePrevPage}>
                        <FaChevronLeft />
                    </button>
                </li>

                {/* The chunked page numbers */}
                {chunkPages.map((pageNum) => (
                    <li
                        key={pageNum}
                        className={`page-item ${pageNum === currentPage ? 'active' : ''}`}
                    >
                        <button
                            className="page-link"
                            onClick={() => onPageChange(pageNum)}
                        >
                            {pageNum}
                        </button>
                    </li>
                ))}

                {/* Single-page Next */}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={handleNextPage}>
                        <FaChevronRight />
                    </button>
                </li>

                {/* Next chunk button (optional) */}
                {hasNextChunk && (
                    <li className="page-item">
                        <button className="page-link" onClick={handleNextChunk}>
                            Next 5 »
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Pagination;
