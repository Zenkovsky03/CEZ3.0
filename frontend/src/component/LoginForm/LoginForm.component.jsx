import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InputField from '../InputField/InputField.component';
import PasswordField from '../PasswordField/PasswordField.component';

const LoginForm = ({ showPassword, togglePasswordVisibility, onSubmit, loading, error }) => {
    const { t } = useTranslation();
    return (
        <form className="form-container" onSubmit={onSubmit}>
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="input-group">
                <InputField
                    label={t('auth.email_username')}
                    name="email"
                    type="text"
                    placeholder={t('auth.login_placeholder')}
                    required
                />
            </div>

            <div className="input-group">
                <div className="password-label-row">
                        <label className="input-label">{t('auth.password')}</label>
                        <Link className="forgot-password-link" to="/reset-password">{t('auth.forgot_password')}</Link>
                </div>
                <PasswordField
                    label={""}
                    name="password"
                    placeholder={t('auth.password_placeholder_login')}
                    showPassword={showPassword}
                    togglePassword={togglePasswordVisibility}
                    required
                />
            </div>

            <button type="submit" className="button primary-button" disabled={loading}>
                {loading ? t('auth.login_loading') : t('auth.login')}
            </button>


        </form>
    );
};

export default LoginForm;
