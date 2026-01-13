import React from 'react';
import '../../AdminUsersPageNew.scss';

const ProfilePreview = ({ user, role, status, firstName, lastName, username }) => {
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
            'Active': 'Aktywny',
            'Inactive': 'Nieaktywny',
            'Blocked': 'Zablokowany'
        };
        return labels[status] || status;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pl-PL', {
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
                <h3 className="admin-users__edit-user__sidebar-title">Podgląd profilu</h3>
                
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
                <h3 className="admin-users__edit-user__sidebar-title">Statystyki</h3>
                
                <div className="admin-users__edit-user__stats">
                    <div className="admin-users__edit-user__stat-item">
                        <span className="material-symbols-outlined admin-users__edit-user__stat-icon admin-users__edit-user__stat-icon--blue">calendar_today</span>
                        <div className="admin-users__edit-user__stat-content">
                            <p className="admin-users__edit-user__stat-label">Data dołączenia</p>
                            <p className="admin-users__edit-user__stat-value">{formatDate(user.createdAt)}</p>
                        </div>
                    </div>
                    
                    <div className="admin-users__edit-user__stat-item">
                        <span className="material-symbols-outlined admin-users__edit-user__stat-icon admin-users__edit-user__stat-icon--green">verified</span>
                        <div className="admin-users__edit-user__stat-content">
                            <p className="admin-users__edit-user__stat-label">Status weryfikacji</p>
                            <p className="admin-users__edit-user__stat-value">
                                {user.isActive ? 'Zweryfikowany' : 'Niezweryfikowany'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="admin-users__edit-user__stat-item">
                        <span className="material-symbols-outlined admin-users__edit-user__stat-icon admin-users__edit-user__stat-icon--purple">badge</span>
                        <div className="admin-users__edit-user__stat-content">
                            <p className="admin-users__edit-user__stat-label">ID użytkownika</p>
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
                        <p className="admin-users__edit-user__info-title">Informacja</p>
                        <p className="admin-users__edit-user__info-text">
                            Zmiany w danych użytkownika zostaną zapisane natychmiast po kliknięciu przycisku "Zapisz zmiany".
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePreview;
