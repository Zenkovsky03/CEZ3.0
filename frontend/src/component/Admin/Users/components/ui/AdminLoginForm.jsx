import React from 'react';
import '../../AdminUsersPageNew.scss';
import { useTranslation } from 'react-i18next';

const AdminLoginForm = ({ 
    loginData, 
    onInputChange, 
    onSubmit, 
    loading, 
    error 
}) => {
    const { t } = useTranslation();
    return (
        <div className="admin-users__login">
            <div className="admin-users__login-container">
                <div className="admin-users__login-header">
                    <h1>{t('admin.panel_title')}</h1>
                    <p>{t('auth.login_admin')}</p>
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
                            <label>{t('auth.username')}</label>
                            <input
                                type="text"
                                value={loginData.username}
                                onChange={(e) => onInputChange({ ...loginData, username: e.target.value })}
                                placeholder={t('admin.login_username_placeholder')}
                                required
                            />
                        </div>

                        <div className="admin-users__form-group">
                            <label>{t('auth.password')}</label>
                            <input
                                type="password"
                                value={loginData.password}
                                onChange={(e) => onInputChange({ ...loginData, password: e.target.value })}
                                placeholder={t('admin.login_password_placeholder')}
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
                                    <span>{t('admin.login_loading_text')}</span>
                                </>
                            ) : (
                                t('auth.login')
                            )}
                        </button>
                    </form>
                </div>

                <div className="admin-users__login-footer">
                    <p>
                        <span className="material-symbols-outlined">info</span>
                        {t('admin.login_info_text')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginForm;
