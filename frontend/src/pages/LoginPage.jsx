import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';


const Logo = () => (
    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" fill="currentColor"></path>
    </svg>
);

const UsosWebIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
);


const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <form className="form-container">
            <div className="input-group">
                <label className="input-label" htmlFor="email">Adres e-mail / Nazwa użytkownika</label>
                <div className="input-wrapper">
                    <div className="input-icon-container">
                        <span className="material-symbols-outlined input-icon">person</span>
                    </div>
                    <input id="email" name="email" type="email" required autoComplete="email" placeholder="Wprowadź swój e-mail lub login" className="text-input" style={{ paddingLeft: '2.5rem', paddingRight: '0.75rem' }} />
                </div>
            </div>

            <div className="input-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label className="input-label" htmlFor="password">Hasło</label>
                    <Link className="link" to="/reset-hasla" style={{ fontSize: '0.875rem' }}>Nie pamiętasz hasła?</Link>
                </div>
                <div className="input-wrapper">
                    <div className="input-icon-container">
                        <span className="material-symbols-outlined input-icon">lock</span>
                    </div>
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="current-password"
                        placeholder="Wprowadź swoje hasło"
                        className="text-input"
                        style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                    />
                    <button
                        type="button"
                        aria-label="Pokaż hasło"
                        className="password-toggle-button"
                        onClick={togglePasswordVisibility}
                    >
                        {/* Zmiana ikony na podstawie stanu */}
                        <span className="material-symbols-outlined text-xl">
                            {showPassword ? "visibility" : "visibility_off"}
                        </span>
                    </button>
                </div>
            </div>
            <button type="submit" className="primary-button">Zaloguj się</button>
        </form>
    );
};


const LoginPage = () => {
    return (
        <div className="page-wrapper-login">
            <div className="page-container">
                <main className="main-content">
                    <div className="login-wrapper">
                        <div className="login-header-text">
                            <h1 className="login-title">Witaj z powrotem!</h1>
                            <p className="login-subtitle">Zaloguj się na swoje konto, aby kontynuować naukę.</p>
                        </div>

                        <div className="login-card">
                            <LoginForm />

                            <div className="divider">
                                <div className="divider-line" aria-hidden="true"></div>
                                <div className="divider-text-container">
                                    <span className="divider-text">Lub zaloguj się przez</span>
                                </div>
                            </div>

                            <button type="button" className="secondary-button">
                                <UsosWebIcon />
                                <span>USOSweb</span>
                            </button>
                        </div>

                        <p className="register-link-text">
                            Nie masz konta? <Link className="link" to="/rejestracja">Zarejestruj się</Link>
                        </p>
                    </div>
                </main>

                <footer className="page-footer">
                    <div className="footer-links">
                        <Link className="hover:underline" to="/regulamin">Regulamin</Link>
                        <span>·</span>
                        <Link className="hover:underline" to="/polityka-prywatnosci">Polityka Prywatności</Link>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LoginPage;