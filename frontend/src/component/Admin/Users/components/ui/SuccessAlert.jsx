import React from 'react';
import '../../AdminUsersPageNew.scss';

const SuccessAlert = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="admin-users__alert admin-users__alert--success">
            <span className="material-symbols-outlined admin-users__alert-icon">
                check_circle
            </span>
            <div className="admin-users__alert-content">
                <div className="admin-users__alert-message">{message}</div>
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

export default SuccessAlert;
