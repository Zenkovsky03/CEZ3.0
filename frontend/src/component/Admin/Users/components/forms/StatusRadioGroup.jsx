import React from 'react';
import '../../AdminUsersPageNew.scss';

const StatusRadioGroup = ({ value, onChange }) => {
    const statuses = [
        { value: 'Active', label: 'Aktywny', color: 'green' },
        { value: 'Inactive', label: 'Nieaktywny', color: 'gray' },
        { value: 'Blocked', label: 'Zablokowany', color: 'red' }
    ];

    return (
        <div className="admin-users__edit-user__field">
            <label className="admin-users__edit-user__label">
                Status konta
            </label>
            <div className="admin-users__edit-user__radio-group">
                {statuses.map((status) => (
                    <label 
                        key={status.value}
                        className={`admin-users__edit-user__radio-label ${value === status.value ? 'admin-users__edit-user__radio-label--active' : ''}`}
                    >
                        <input
                            type="radio"
                            name="status"
                            value={status.value}
                            checked={value === status.value}
                            onChange={onChange}
                            className="admin-users__edit-user__radio-input"
                        />
                        <span className="admin-users__edit-user__radio-content">
                            <span className={`admin-users__edit-user__status-dot admin-users__edit-user__status-dot--${status.color}`}></span>
                            <span className="admin-users__edit-user__radio-text">{status.label}</span>
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default StatusRadioGroup;
