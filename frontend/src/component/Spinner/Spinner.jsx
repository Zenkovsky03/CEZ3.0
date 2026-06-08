import React from 'react';
import './Spinner.scss';

const Spinner = ({ size = 'md', className = '' }) => {
    return (
        <div className={`spinner spinner--${size} ${className}`} role="status" aria-label="Loading">
            <span className="spinner__circle" />
        </div>
    );
};

export default Spinner;
