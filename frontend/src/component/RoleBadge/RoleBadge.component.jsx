import React from 'react';
import './RoleBadge.scss';

const RoleBadge = ({ role }) => {
    const getRoleConfig = () => {
        const roleMap = {
            'Student': { text: 'Student', className: 'student' },
            'Teacher': { text: 'Nauczyciel', className: 'teacher' },
            'Admin': { text: 'Administrator', className: 'admin' }
        };
        return roleMap[role] || { text: role, className: 'default' };
    };

    const config = getRoleConfig();

    return (
        <span className={`role-badge role-${config.className}`}>
            {config.text}
        </span>
    );
};

export default RoleBadge;