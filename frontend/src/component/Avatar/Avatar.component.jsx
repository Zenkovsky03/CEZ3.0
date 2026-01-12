import React from 'react';

const Avatar = ({ firstName, lastName, username, size = 'medium' }) => {
    const getInitials = () => {
        const first = firstName?.[0] || '';
        const last = lastName?.[0] || '';

        if (first || last) {
            return (first + last).toUpperCase();
        }

        // Fallback: użyj pierwszych 2 liter username
        if (username) {
            return username.slice(0, 2).toUpperCase();
        }

        return '?';
    };

    return (
        <div className={`avatar avatar-${size}`}>
            {getInitials()}
        </div>
    );
};

export default Avatar;