import React from 'react';
import { Link } from 'react-router-dom';
import InputField from '../InputField/InputField.component';
import PasswordField from '../PasswordField/PasswordField.component';

const LoginForm = ({ showPassword, togglePasswordVisibility }) => {
    return (
        <form className="form-container">
            <div className="input-group">
                <InputField
                    label="Adres e-mail / Nazwa użytkownika"
                    name="email"
                    type="email"
                    placeholder="Wprowadź swój e-mail lub login"
                />
            </div>

            <div className="input-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label className="input-label">Hasło</label>
                    <Link className="link" to="/password-reset" style={{ fontSize: '0.875rem', color: 'rgb(58 124 165)', textDecoration: 'none' }}>Nie pamiętasz hasła?</Link>
                </div>
                <PasswordField
                    label={""}
                    name="password"
                    placeholder="Wprowadź swoje hasło"
                    showPassword={showPassword}
                    togglePassword={togglePasswordVisibility}
                />
            </div>
            <button type="submit" className="button primary-button">Zaloguj się</button>
        </form>
    );
};

export default LoginForm;
