import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getResetToken, resetPassword } from '../../services/authService';
import './ResetPassword.scss';

const ResetPassword = () => {
    const { t } = useTranslation();
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
            setError(err.message || t('auth.reset_token_error'));
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
            setError(err.message || t('auth.reset_password_error'));
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
                                    <h1 className="reset-title">{t('auth.reset_password')}</h1>
                                    <p className="reset-subtitle">{t('auth.reset_subtitle')}</p>
                                </>
                            ) : (
                                <>
                                    <div className="reset-icon-wrap">
                                        <span className="material-symbols-outlined">password</span>
                                    </div>
                                    <h1 className="reset-title">{t('auth.new_password')}</h1>
                                    <p className="reset-subtitle" dangerouslySetInnerHTML={{ __html: t('auth.new_password_for', { username }) }} />
                                    {resetToken && (
                                        <div className="reset-token-display">
                                            <span className="material-symbols-outlined">vpn_key</span>
                                            <span>{t('auth.token_display', { token: resetToken })}</span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        {step === 1 ? (
                            <form className="reset-form" onSubmit={handleEmailSubmit}>
                                <div className="form-group">
                                    <label htmlFor="username" className="form-label">{t('auth.username')}</label>
                                    <div className="input-wrap">
                                        <span className="material-symbols-outlined input-icon">person</span>
                                        <input id="username" type="text" className="form-input" placeholder={t('auth.username_placeholder')} value={username} onChange={(e) => setUsername(e.target.value)} required />
                                    </div>
                                </div>
                                <button type="submit" className="btn-primary" disabled={!username.trim() || loading}>
                                    {loading ? t('auth.sending_token') : t('auth.send_token')}
                                </button>
                                <Link to="/login" className="back-to-login">
                                    <span className="material-symbols-outlined">arrow_back</span>
                                    {t('auth.back_to_login')}
                                </Link>
                            </form>
                        ) : (
                            <form className="reset-form" onSubmit={handlePasswordSubmit}>
                                <div className="form-group">
                                    <label htmlFor="token" className="form-label">{t('auth.reset_token')}</label>
                                    <div className="input-wrap">
                                        <span className="material-symbols-outlined input-icon">vpn_key</span>
                                        <input id="token" type="text" className="form-input" placeholder={t('auth.token_placeholder')} value={resetToken} onChange={(e) => setResetToken(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">{t('auth.new_password')}</label>
                                    <div className="input-wrap">
                                        <span className="material-symbols-outlined input-icon">lock</span>
                                        <input id="password" type="password" className="form-input" placeholder={t('auth.min_chars_8')} value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirm" className="form-label">{t('auth.password_copy')}</label>
                                    <div className="input-wrap">
                                        <span className="material-symbols-outlined input-icon">lock</span>
                                        <input id="confirm" type="password" className="form-input" placeholder={t('auth.confirm_password')} value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
                                    </div>
                                    {password && confirm && password !== confirm && (
                                        <p className="input-error">{t('auth.password_mismatch')}</p>
                                    )}
                                </div>
                                <button type="submit" className="btn-primary" disabled={!password || !confirm || password !== confirm || loading}>
                                    {loading ? t('auth.saving_password') : t('auth.set_new_password')}
                                </button>
                            </form>
                        )}
                    </>
                ) : (
                    <div className="success-state">
                        <div className="success-icon-wrap">
                            <span className="material-symbols-outlined">check_circle</span>
                        </div>
                        <h1 className="reset-title">{t('auth.password_changed')}</h1>
                        <p className="reset-subtitle">{t('auth.password_changed_desc')}</p>
                        <Link to="/login" className="btn-primary">{t('auth.go_to_login')}</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
