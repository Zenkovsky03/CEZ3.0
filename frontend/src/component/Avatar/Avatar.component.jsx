import React from 'react';

const Avatar = ({ firstName, lastName, size = 'medium' }) => {
    const getInitials = () => {
        const first = firstName?.[0] || '';
        const last = lastName?.[0] || '';
        return (first + last).toUpperCase();
    };

    return (
        <div className={`avatar avatar-${size}`}>
            {getInitials()}
        </div>
    );
};

export default Avatar;