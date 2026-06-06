import React from 'react';
import { Link } from 'react-router-dom';
import InputField from '../InputField/InputField.component';
import PasswordField from '../PasswordField/PasswordField.component';

const LoginForm = ({ showPassword, togglePasswordVisibility, onSubmit, loading, error }) => {
    return (
        <form className="form-container" onSubmit={onSubmit}>
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="input-group">
                <InputField
                    label="Adres e-mail / Nazwa użytkownika"
                    name="email"
                    type="text"
                    placeholder="Wprowadź swój e-mail lub login"
                    required
                />
            </div>

            <div className="input-group">
                <div className="password-label-row">
                    <label className="input-label">Hasło</label>
                    <Link className="forgot-password-link" to="/reset-password">Nie pamiętasz hasła?</Link>
                </div>
                <PasswordField
                    label={""}
                    name="password"
                    placeholder="Wprowadź swoje hasło"
                    showPassword={showPassword}
                    togglePassword={togglePasswordVisibility}
                    required
                />
            </div>

            <button type="submit" className="button primary-button" disabled={loading}>
                {loading ? 'Logowanie...' : 'Zaloguj się'}
            </button>


        </form>
    );
};

export default LoginForm;
