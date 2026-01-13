import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../AdminUsersPageNew.scss';

const UsersTable = ({ users, loading, onDeleteClick }) => {
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRoleBadgeColor = (role) => {
        const colors = {
            'Admin': 'admin-users__badge--admin',
            'Teacher': 'admin-users__badge--teacher',
            'Student': 'admin-users__badge--student',
        };
        return colors[role] || 'admin-users__badge--default';
    };

    const getStatusBadge = (user) => {
        if (user.isBlocked) {
            return (
                <span className="admin-users__badge admin-users__badge--blocked">
                    Zablokowany
                </span>
            );
        }
        if (user.isActive) {
            return (
                <span className="admin-users__badge admin-users__badge--active">
                    Aktywny
                </span>
            );
        }
        return (
            <span className="admin-users__badge admin-users__badge--inactive">
                Nieaktywny
            </span>
        );
    };

    if (loading) {
        return (
            <div className="admin-users__table-container">
                <div className="admin-users__loading">
                    <div className="admin-users__loading-spinner"></div>
                    <p>Ładowanie użytkowników...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-users__table-container">
            <div className="admin-users__table-wrapper">
                <table className="admin-users__table">
                    <thead className="admin-users__table-head">
                        <tr>
                            <th className="admin-users__table-th">Użytkownik</th>
                            <th className="admin-users__table-th">Email</th>
                            <th className="admin-users__table-th">Rola</th>
                            <th className="admin-users__table-th">Status</th>
                            <th className="admin-users__table-th">Data utworzenia</th>
                            <th className="admin-users__table-th admin-users__table-th--actions">
                                Akcje
                            </th>
                        </tr>
                    </thead>
                    <tbody className="admin-users__table-body">
                        {users.map((user) => (
                            <tr key={user.id} className="admin-users__table-row">
                                <td className="admin-users__table-td">
                                    <div className="admin-users__user-cell">
                                        <div className="admin-users__user-avatar">
                                            {user.firstName[0]}{user.lastName[0]}
                                        </div>
                                        <div className="admin-users__user-info">
                                            <div className="admin-users__user-name">
                                                {user.firstName} {user.lastName}
                                            </div>
                                            <div className="admin-users__user-username">
                                                @{user.username}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="admin-users__table-td">
                                    <div className="admin-users__user-email">{user.email}</div>
                                </td>
                                <td className="admin-users__table-td">
                                    <span className={`admin-users__badge ${getRoleBadgeColor(user.role)}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="admin-users__table-td">
                                    {getStatusBadge(user)}
                                </td>
                                <td className="admin-users__table-td admin-users__table-td--date">
                                    {formatDate(user.createdAt)}
                                </td>
                                <td className="admin-users__table-td admin-users__table-td--actions">
                                    <div className="admin-users__actions">
                                        <button 
                                            className={`admin-users__action-btn ${
                                                user.role === 'Admin' 
                                                    ? 'admin-users__action-btn--disabled' 
                                                    : 'admin-users__action-btn--edit'
                                            }`}
                                            title={user.role === 'Admin' ? 'Nie można edytować admina' : 'Edytuj'}
                                            onClick={() => user.role !== 'Admin' && navigate(`/admin/users/edit/${user.id}`)}
                                            disabled={user.role === 'Admin'}
                                        >
                                            <span className="material-symbols-outlined">edit</span>
                                        </button>
                                        <button 
                                            className={`admin-users__action-btn ${
                                                user.role === 'Admin' 
                                                    ? 'admin-users__action-btn--disabled' 
                                                    : 'admin-users__action-btn--delete'
                                            }`}
                                            title={user.role === 'Admin' ? 'Nie można usunąć admina' : 'Usuń'}
                                            onClick={() => user.role !== 'Admin' && onDeleteClick(user)}
                                            disabled={user.role === 'Admin'}
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersTable;
