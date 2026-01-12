import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../InputField/InputField.component';
import PasswordField from '../PasswordField/PasswordField.component';
import AuthContext from '../../context/AuthContext';

const LoginForm = ({ showPassword, togglePasswordVisibility }) => {
    const { login } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const form = new FormData(e.target);
        const login_value = form.get('login');
        const password = form.get('password');

        try {
            await login({ login: login_value, password });
            navigate('/');
        } catch (err) {
            setError(err.data?.message || err.message || 'Błąd logowania');
        }
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <div className="input-group">
                <InputField
                    label="Login"
                    name="login"
                    type="text"
                    placeholder="E-mail/nazwa użytkownika"
                    required
                />
            </div>

            <div className="input-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label className="input-label">Hasło</label>
                    <Link className="link" to="/password-reset" style={{ fontSize: '0.875rem', color: 'rgb(58 124 165)', textDecoration: 'none' }}>Nie pamiętasz hasła?</Link>
                </div>
                <PasswordField
                    label=""
                    name="password"
                    placeholder="Wprowadź swoje hasło"
                    showPassword={showPassword}
                    togglePassword={togglePasswordVisibility}
                    required
                />
            </div>

            {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

            <button type="submit" className="button primary-button">Zaloguj się</button>
        </form>
    );
};

export default LoginForm;
