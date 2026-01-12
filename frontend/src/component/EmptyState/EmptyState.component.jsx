import React from 'react';

const EmptyState = ({ message, icon }) => {
    return (
        <div className="empty-state">
            {icon && <div className="empty-state-icon">{icon}</div>}
            <p className="empty-state-message">{message}</p>
        </div>
    );
};

export default EmptyState;