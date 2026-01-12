import React from 'react';

const PasswordField = ({ label, placeholder, showPassword, togglePassword, name, required = false }) => (
    <label className="field-label">
        <p className="input-label-text">{label}</p>
        <div className="password-container">
            <input className="form-input password-input" name={name} placeholder={placeholder} type={showPassword ? 'text' : 'password'} required={required} />
            <button className="toggle-password" type="button" onClick={togglePassword}>
                <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility' : 'visibility_off'}</span>
            </button>
        </div>
    </label>
);

export default PasswordField;
