import React, { useMemo } from 'react';
import '../../AdminCoursesPage.scss';

const CoursesPagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
    const pagesToShow = useMemo(() => {
        const pages = [];
        const start = Math.max(1, currentPage - 1);
        const end = Math.min(totalPages, currentPage + 1);

        if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push('dots-left');
        }

        for (let p = start; p <= end; p += 1) {
            pages.push(p);
        }

        if (end < totalPages) {
            if (end < totalPages - 1) pages.push('dots-right');
            pages.push(totalPages);
        }

        return pages;
    }, [currentPage, totalPages]);

    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="admin-courses__pagination">
            <div className="admin-courses__pagination-info">
                Wyświetlanie {startItem}-{endItem} z {totalItems} kursów
            </div>

            <div className="admin-courses__pagination-controls">
                <button
                    type="button"
                    className="admin-courses__pagination-btn admin-courses__pagination-btn--nav"
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                >
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>

                {pagesToShow.map((page) => {
                    if (typeof page === 'string') {
                        return (
                            <span key={page} className="admin-courses__pagination-ellipsis">
                                ...
                            </span>
                        );
                    }

                    return (
                        <button
                            key={page}
                            type="button"
                            className={`admin-courses__pagination-btn ${currentPage === page ? 'admin-courses__pagination-btn--active' : ''}`}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </button>
                    );
                })}

                <button
                    type="button"
                    className="admin-courses__pagination-btn admin-courses__pagination-btn--nav"
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                >
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>
        </div>
    );
};

export default CoursesPagination;
