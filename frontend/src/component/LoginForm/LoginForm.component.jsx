import React from 'react';
import { Link } from 'react-router-dom';
import InputField from '../InputField/InputField.component';
import PasswordField from '../PasswordField/PasswordField.component';

const LoginForm = ({ showPassword, togglePasswordVisibility, onSubmit, loading, error }) => {
    return (
        <form className="form-container" onSubmit={onSubmit}>
            {error && (
                <div style={{ 
                    padding: '0.75rem 1rem', 
                    backgroundColor: '#fef2f2', 
                    border: '1px solid #fecaca', 
                    borderRadius: '0.5rem', 
                    color: '#991b1b', 
                    fontSize: '0.875rem',
                    marginBottom: '1rem'
                }}>
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
