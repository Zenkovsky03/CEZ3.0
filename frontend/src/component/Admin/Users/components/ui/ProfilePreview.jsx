import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../AdminUsersPageNew.scss';

const ProfilePreview = ({ user, role, status, firstName, lastName, username }) => {
    const { t } = useTranslation();

    const getRoleIcon = (role) => {
        const icons = {
            'Admin': 'admin_panel_settings',
            'Teacher': 'school',
            'Student': 'person'
        };
        return icons[role] || 'person';
    };

    const getRoleClass = (role) => {
        const classes = {
            'Admin': 'admin-users__edit-user__badge--admin',
            'Teacher': 'admin-users__edit-user__badge--teacher',
            'Student': 'admin-users__edit-user__badge--student'
        };
        return classes[role] || '';
    };

    const getStatusClass = (status) => {
        const classes = {
            'Active': 'admin-users__edit-user__badge--active',
            'Inactive': 'admin-users__edit-user__badge--inactive',
            'Blocked': 'admin-users__edit-user__badge--blocked'
        };
        return classes[status] || '';
    };

    const getStatusLabel = (status) => {
        const labels = {
            'Active': t('admin.status_active'),
            'Inactive': t('admin.status_inactive'),
            'Blocked': t('admin.status_blocked')
        };
        return labels[status] || status;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="admin-users__edit-user__sidebar">
            {/* Profile Preview */}
            <div className="admin-users__edit-user__card">
                <h3 className="admin-users__edit-user__sidebar-title">{t('admin.profile_preview')}</h3>
                
                <div className="admin-users__edit-user__profile-preview">
                    <div className="admin-users__edit-user__avatar">
                        {firstName[0]}{lastName[0]}
                    </div>
                    
                    <h4 className="admin-users__edit-user__profile-name">
                        {firstName} {lastName}
                    </h4>
                    
                    <p className="admin-users__edit-user__profile-username">@{username}</p>
                    
                    <div className="admin-users__edit-user__profile-badges">
                        <span className={`admin-users__edit-user__badge ${getRoleClass(role)}`}>
                            <span className="material-symbols-outlined admin-users__edit-user__badge-icon">{getRoleIcon(role)}</span>
                            {role}
                        </span>
                    </div>
                    
                    <div className="admin-users__edit-user__profile-status">
                        <span className={`admin-users__edit-user__badge ${getStatusClass(status)}`}>
                            <span className={`admin-users__edit-user__status-dot admin-users__edit-user__status-dot--${status === 'Active' ? 'green' : status === 'Blocked' ? 'red' : 'gray'}`}></span>
                            {getStatusLabel(status)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="admin-users__edit-user__card">
                <h3 className="admin-users__edit-user__sidebar-title">{t('admin.statistics')}</h3>
                
                <div className="admin-users__edit-user__stats">
                    <div className="admin-users__edit-user__stat-item">
                        <span className="material-symbols-outlined admin-users__edit-user__stat-icon admin-users__edit-user__stat-icon--blue">calendar_today</span>
                        <div className="admin-users__edit-user__stat-content">
                            <p className="admin-users__edit-user__stat-label">{t('admin.enrollment_date')}</p>
                            <p className="admin-users__edit-user__stat-value">{formatDate(user.createdAt)}</p>
                        </div>
                    </div>
                    
                    <div className="admin-users__edit-user__stat-item">
                        <span className="material-symbols-outlined admin-users__edit-user__stat-icon admin-users__edit-user__stat-icon--green">verified</span>
                        <div className="admin-users__edit-user__stat-content">
                            <p className="admin-users__edit-user__stat-label">{t('admin.verification_status')}</p>
                            <p className="admin-users__edit-user__stat-value">
                                {user.isActive ? t('admin.verified') : t('admin.unverified')}
                            </p>
                        </div>
                    </div>
                    
                    <div className="admin-users__edit-user__stat-item">
                        <span className="material-symbols-outlined admin-users__edit-user__stat-icon admin-users__edit-user__stat-icon--purple">badge</span>
                        <div className="admin-users__edit-user__stat-content">
                            <p className="admin-users__edit-user__stat-label">{t('admin.user_id')}</p>
                            <p className="admin-users__edit-user__stat-value admin-users__edit-user__stat-value--mono">{user.id}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Box */}
            <div className="admin-users__edit-user__info-box">
                <div className="admin-users__edit-user__info-content">
                    <span className="material-symbols-outlined admin-users__edit-user__info-icon">info</span>
                    <div>
                        <p className="admin-users__edit-user__info-title">{t('admin.info')}</p>
                        <p className="admin-users__edit-user__info-text">
                            {t('admin.info_text')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePreview;
