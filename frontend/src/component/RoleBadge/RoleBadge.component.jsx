import React from 'react';
import { useTranslation } from 'react-i18next';
import './RoleBadge.scss';

const RoleBadge = ({ role }) => {
    const { t } = useTranslation();
    const getRoleConfig = () => {
        const roleMap = {
            'Student': { key: 'role.student', className: 'student' },
            'Teacher': { key: 'role.teacher', className: 'teacher' },
            'Admin': { key: 'role.admin', className: 'admin' }
        };
        const config = roleMap[role] || { key: null, className: 'default' };
        return { text: config.key ? t(config.key) : role, className: config.className };
    };

    const config = getRoleConfig();

    return (
        <span className={`role-badge role-${config.className}`}>
            {config.text}
        </span>
    );
};

export default RoleBadge;