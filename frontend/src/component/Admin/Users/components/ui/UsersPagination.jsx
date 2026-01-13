import React from 'react';
import '../../AdminUsersPageNew.scss';

const UsersPagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    totalItems,
    itemsPerPage 
}) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="admin-users__pagination">
            <div className="admin-users__pagination-info">
                Wyświetlanie {startItem}-{endItem} z {totalItems} użytkowników
            </div>
            <div className="admin-users__pagination-controls">
                <button 
                    className="admin-users__pagination-btn admin-users__pagination-btn--nav"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                
                {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <span key={`ellipsis-${index}`} className="admin-users__pagination-ellipsis">
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            className={`admin-users__pagination-btn ${
                                currentPage === page 
                                    ? 'admin-users__pagination-btn--active' 
                                    : ''
                            }`}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </button>
                    )
                ))}
                
                <button 
                    className="admin-users__pagination-btn admin-users__pagination-btn--nav"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>
        </div>
    );
};

export default UsersPagination;
