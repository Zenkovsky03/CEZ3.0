import React from 'react';
import Spinner from '../../../../Spinner';

const LoadingSpinner = () => {
    return (
        <div className="admin-users__loading">
            <Spinner size="lg" />
        </div>
    );
};

export default LoadingSpinner;
