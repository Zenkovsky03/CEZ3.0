import React from 'react';
import '../../AdminUsersPageNew.scss';

const UserStatsCards = ({ totalUsers, stats }) => {
    return (
        <div className="admin-users__stats">
            <div className="admin-users__stat-card">
                <div className="admin-users__stat-icon admin-users__stat-icon--blue">
                    <span className="material-symbols-outlined">group</span>
                </div>
                <div className="admin-users__stat-info">
                    <p className="admin-users__stat-info-label">Wszyscy Użytkownicy</p>
                    <p className="admin-users__stat-info-value">{totalUsers}</p>
                </div>
            </div>

            <div className="admin-users__stat-card">
                <div className="admin-users__stat-icon admin-users__stat-icon--green">
                    <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div className="admin-users__stat-info">
                    <p className="admin-users__stat-info-label">Aktywni</p>
                    <p className="admin-users__stat-info-value">{stats.totalActive}</p>
                </div>
            </div>

            <div className="admin-users__stat-card">
                <div className="admin-users__stat-icon admin-users__stat-icon--purple">
                    <span className="material-symbols-outlined">admin_panel_settings</span>
                </div>
                <div className="admin-users__stat-info">
                    <p className="admin-users__stat-info-label">Administratorzy</p>
                    <p className="admin-users__stat-info-value">{stats.totalAdmins}</p>
                </div>
            </div>

            <div className="admin-users__stat-card">
                <div className="admin-users__stat-icon admin-users__stat-icon--orange">
                    <span className="material-symbols-outlined">school</span>
                </div>
                <div className="admin-users__stat-info">
                    <p className="admin-users__stat-info-label">Nauczyciele</p>
                    <p className="admin-users__stat-info-value">{stats.totalTeachers}</p>
                </div>
            </div>
        </div>
    );
};

export default UserStatsCards;
