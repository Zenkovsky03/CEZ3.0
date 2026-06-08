import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../AdminUsersPageNew.scss';

const ErrorAlert = ({ error, onClose }) => {
    const { t } = useTranslation();
    if (!error) return null;

    return (
        <div className="admin-users__alert admin-users__alert--error">
            <span className="material-symbols-outlined admin-users__alert-icon">
                error
            </span>
            <div className="admin-users__alert-content">
                <div className="admin-users__alert-title">{t('common.error')}</div>
                <div className="admin-users__alert-message">{error}</div>
            </div>
            {onClose && (
                <button 
                    className="admin-users__alert-close"
                    onClick={onClose}
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            )}
        </div>
    );
};

export default ErrorAlert;
