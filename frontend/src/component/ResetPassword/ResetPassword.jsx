import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ResetPassword.scss';

const ResetPassword = () => {
    const [step, setStep] = useState(1); // 1 = enter email, 2 = enter new password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [done, setDone] = useState(false);

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        setDone(true);
    };

    return (
        <div className="reset-password-page">
            <div className="reset-card">
                <div className="reset-logo">
                    <span className="material-symbols-outlined logo-icon">school</span>
                    <span className="logo-text">CEZ 3.0</span>
                </div>

                {!done ? (
                    <>
                        <div className="reset-header">
                            {step === 1 ? (
                                <>
                                    <div className="reset-icon-wrap">
                                        <span className="material-symbols-outlined">lock_reset</span>
                                    </div>
                                    <h1 className="reset-title">Resetuj hasło</h1>
                                    <p className="reset-subtitle">
                                        Podaj adres e-mail powiązany z Twoim kontem. Wyślemy Ci link do zresetowania hasła.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="reset-icon-wrap">
                                        <span className="material-symbols-outlined">password</span>
                                    </div>
                                    <h1 className="reset-title">Nowe hasło</h1>
                                    <p className="reset-subtitle">
                                        Ustaw nowe hasło dla konta <strong>{email}</strong>.
                                    </p>
                                </>
                            )}
                        </div>

                        {step === 1 ? (
                            <form className="reset-form" onSubmit={handleEmailSubmit}>
                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">Adres e-mail</label>
                                    <div className="input-wrap">
                                        <span className="material-symbols-outlined input-icon">mail</span>
                                        <input
                                            id="email"
                                            type="email"
                                            className="form-input"
                                            placeholder="twoj@email.pl"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn-primary" disabled={!email.trim()}>
                                    Wyślij link resetujący
                                </button>
                                <Link to="/login" className="back-to-login">
                                    <span className="material-symbols-outlined">arrow_back</span>
                                    Wróć do logowania
                                </Link>
                            </form>
                        ) : (
                            <form className="reset-form" onSubmit={handlePasswordSubmit}>
                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">Nowe hasło</label>
                                    <div className="input-wrap">
                                        <span className="material-symbols-outlined input-icon">lock</span>
                                        <input
                                            id="password"
                                            type="password"
                                            className="form-input"
                                            placeholder="Minimum 8 znaków"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirm" className="form-label">Powtórz hasło</label>
                                    <div className="input-wrap">
                                        <span className="material-symbols-outlined input-icon">lock</span>
                                        <input
                                            id="confirm"
                                            type="password"
                                            className="form-input"
                                            placeholder="Powtórz nowe hasło"
                                            value={confirm}
                                            onChange={(e) => setConfirm(e.target.value)}
                                            required
                                        />
                                    </div>
                                    {password && confirm && password !== confirm && (
                                        <p className="input-error">Hasła nie są identyczne</p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={!password || !confirm || password !== confirm}
                                >
                                    Ustaw nowe hasło
                                </button>
                            </form>
                        )}
                    </>
                ) : (
                    <div className="success-state">
                        <div className="success-icon-wrap">
                            <span className="material-symbols-outlined">check_circle</span>
                        </div>
                        <h1 className="reset-title">Hasło zmienione!</h1>
                        <p className="reset-subtitle">Twoje hasło zostało pomyślnie zmienione. Możesz się teraz zalogować.</p>
                        <Link to="/login" className="btn-primary">
                            Przejdź do logowania
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
