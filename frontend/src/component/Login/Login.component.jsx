import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './Login.scss';
import UsosWebIcon from '../UsosWebIcon';
import LoginForm from '../LoginForm';
import AuthContext from '../../context/AuthContext';


const Login = () => {
    const { user } = useContext(AuthContext);

    if (user) {
        return <Navigate to="/" replace />;
    }

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

                            <button type="button" className="button secondary-button">
                                <UsosWebIcon />
                                <span>USOSweb</span>
                            </button>
                        </div>

                        <p className="register-link-text">
                            Nie masz konta? <Link className="link" to="/register">Zarejestruj się</Link>
                        </p>
                    </div>
                </main>

                <footer className="page-footer">
                    <div className="footer-links">
                        <span>&copy; {new Date().getFullYear()} CEZ 3.0</span>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Login;