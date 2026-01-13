import React from 'react';
import '../../AdminUsersPageNew.scss';

const FormField = ({ 
    label, 
    name, 
    type = 'text', 
    value, 
    onChange, 
    error, 
    disabled = false, 
    placeholder = '', 
    helperText = null 
}) => {
    return (
        <div className="admin-users__edit-user__field">
            <label className="admin-users__edit-user__label">
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                className={`admin-users__edit-user__input ${error ? 'admin-users__edit-user__input--error' : ''} ${disabled ? 'admin-users__edit-user__input--disabled' : ''}`}
            />
            {error && (
                <p className="admin-users__edit-user__error-text">{error}</p>
            )}
            {helperText && !error && (
                <p className="admin-users__edit-user__helper-text">{helperText}</p>
            )}
        </div>
    );
};

export default FormField;
