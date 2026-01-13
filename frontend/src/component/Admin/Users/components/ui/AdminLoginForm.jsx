import React from 'react';
import '../../AdminUsersPageNew.scss';

const AdminLoginForm = ({ 
    loginData, 
    onInputChange, 
    onSubmit, 
    loading, 
    error 
}) => {
    return (
        <div className="admin-users__login">
            <div className="admin-users__login-container">
                <div className="admin-users__login-header">
                    <h1>Panel Administratora</h1>
                    <p>Zaloguj się, aby zarządzać platformą</p>
                </div>

                <div className="admin-users__login-card">
                    {error && (
                        <div className="admin-users__login-error">
                            <span className="material-symbols-outlined">error</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="admin-users__login-form">
                        <div className="admin-users__form-group">
                            <label>Nazwa użytkownika</label>
                            <input
                                type="text"
                                value={loginData.username}
                                onChange={(e) => onInputChange({ ...loginData, username: e.target.value })}
                                placeholder="Wprowadź nazwę użytkownika"
                                required
                            />
                        </div>

                        <div className="admin-users__form-group">
                            <label>Hasło</label>
                            <input
                                type="password"
                                value={loginData.password}
                                onChange={(e) => onInputChange({ ...loginData, password: e.target.value })}
                                placeholder="Wprowadź hasło"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="admin-users__login-btn"
                        >
                            {loading ? (
                                <>
                                    <div className="admin-users__login-btn-spinner"></div>
                                    <span>Logowanie...</span>
                                </>
                            ) : (
                                'Zaloguj się'
                            )}
                        </button>
                    </form>
                </div>

                <div className="admin-users__login-footer">
                    <p>
                        <span className="material-symbols-outlined">info</span>
                        Tylko użytkownicy z uprawnieniami administratora mogą się zalogować
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginForm;
