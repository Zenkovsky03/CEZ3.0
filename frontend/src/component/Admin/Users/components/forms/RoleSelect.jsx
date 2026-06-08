import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../AdminUsersPageNew.scss';

const RoleSelect = ({ value, onChange }) => {
    const { t } = useTranslation();
    return (
        <div className="admin-users__edit-user__field">
            <label className="admin-users__edit-user__label">
                {t('admin.role_label')}
            </label>
            <div className="admin-users__edit-user__select-wrapper">
                <select
                    value={value}
                    onChange={onChange}
                    className="admin-users__edit-user__select"
                >
                    <option value="Admin">{t('role.Admin')}</option>
                    <option value="Teacher">{t('role.Teacher')}</option>
                    <option value="Student">{t('role.Student')}</option>
                </select>
                <span className="material-symbols-outlined admin-users__edit-user__select-icon">
                    expand_more
                </span>
            </div>
        </div>
    );
};

export default RoleSelect;
