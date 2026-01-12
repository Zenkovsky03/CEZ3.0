import React from 'react';
import './StatusBadge.scss';

const StatusBadge = ({ status, text }) => {
    return (
        <span className={`status-badge status-${status}`}>
            {text}
        </span>
    );
};

export default StatusBadge;