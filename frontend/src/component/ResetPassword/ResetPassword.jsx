import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getResetToken, resetPassword } from '../../services/authService';
import './ResetPassword.scss';

const ResetPassword = () => {
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await getResetToken({ Username: username.trim() });
            setResetToken(result?.resetToken || result?.token || '');
            setStep(2);
        } catch (err) {
            setError(err.message || 'Nie udało się wygenerować tokena resetującego');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await resetPassword({
                UserName: username.trim(),
                ResetToken: resetToken,
                NewPassword: password
            });
            setDone(true);
        } catch (err) {
            setError(err.message || 'Nie udało się zresetować hasła');
        } finally {
            setLoading(false);
        }
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
                                        Podaj nazwę użytkownika powiązaną z Twoim kontem. Wyślemy Ci token do zresetowania hasła.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="reset-icon-wrap">
                                        <span className="material-symbols-outlined">password</span>
                                    </div>
                                    <h1 className="reset-title">Nowe hasło</h1>
                                    <p className="reset-subtitle">
                                        Ustaw nowe hasło dla konta <strong>{username}</strong>.
                                    </p>
                                    {resetToken && (
                                        <div className="reset-token-display">
                                            <span className="material-symbols-outlined">vpn_key</span>
                                            <span>Token: {resetToken}</span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        {step === 1 ? (
                            <form className="reset-form" onSubmit={handleEmailSubmit}>
                                <div className="form-group">
                                    <label htmlFor="username" className="form-label">Nazwa użytkownika</label>
                                    <div className="input-wrap">
                                        <span className="material-symbols-outlined input-icon">person</span>
                                        <input id="username" type="text" className="form-input" placeholder="Twoja nazwa użytkownika" value={username} onChange={(e) => setUsername(e.target.value)} required />
                                    </div>
                                </div>
                                <button type="submit" className="btn-primary" disabled={!username.trim() || loading}>
                                    {loading ? 'Wysyłanie...' : 'Wyślij token resetujący'}
                                </button>
                                <Link to="/login" className="back-to-login">
                                    <span className="material-symbols-outlined">arrow_back</span>
                                    Wróć do logowania
                                </Link>
                            </form>
                        ) : (
                            <form className="reset-form" onSubmit={handlePasswordSubmit}>
                                <div className="form-group">
                                    <label htmlFor="token" className="form-label">Token resetujący</label>
                                    <div className="input-wrap">
                                        <span className="material-symbols-outlined input-icon">vpn_key</span>
                                        <input id="token" type="text" className="form-input" placeholder="Token z emaila" value={resetToken} onChange={(e) => setResetToken(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">Nowe hasło</label>
                                    <div className="input-wrap">
                                        <span className="material-symbols-outlined input-icon">lock</span>
                                        <input id="password" type="password" className="form-input" placeholder="Minimum 8 znaków" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirm" className="form-label">Powtórz hasło</label>
                                    <div className="input-wrap">
                                        <span className="material-symbols-outlined input-icon">lock</span>
                                        <input id="confirm" type="password" className="form-input" placeholder="Powtórz nowe hasło" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
                                    </div>
                                    {password && confirm && password !== confirm && (
                                        <p className="input-error">Hasła nie są identyczne</p>
                                    )}
                                </div>
                                <button type="submit" className="btn-primary" disabled={!password || !confirm || password !== confirm || loading}>
                                    {loading ? 'Zapisywanie...' : 'Ustaw nowe hasło'}
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
                        <Link to="/login" className="btn-primary">Przejdź do logowania</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
