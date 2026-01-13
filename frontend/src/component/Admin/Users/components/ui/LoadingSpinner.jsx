import React from 'react';
import '../../AdminUsersPageNew.scss';

const LoadingSpinner = ({ message = 'Ładowanie...' }) => {
    return (
        <div className="admin-users__loading">
            <div className="admin-users__loading-spinner"></div>
            {message && <p className="admin-users__loading-text">{message}</p>}
        </div>
    );
};

export default LoadingSpinner;
