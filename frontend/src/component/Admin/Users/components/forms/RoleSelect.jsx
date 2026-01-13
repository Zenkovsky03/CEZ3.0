import React from 'react';
import '../../AdminUsersPageNew.scss';

const RoleSelect = ({ value, onChange }) => {
    return (
        <div className="admin-users__edit-user__field">
            <label className="admin-users__edit-user__label">
                Rola
            </label>
            <div className="admin-users__edit-user__select-wrapper">
                <select
                    value={value}
                    onChange={onChange}
                    className="admin-users__edit-user__select"
                >
                    <option value="Admin">Administrator</option>
                    <option value="Teacher">Nauczyciel</option>
                    <option value="Student">Student</option>
                </select>
                <span className="material-symbols-outlined admin-users__edit-user__select-icon">
                    expand_more
                </span>
            </div>
        </div>
    );
};

export default RoleSelect;
