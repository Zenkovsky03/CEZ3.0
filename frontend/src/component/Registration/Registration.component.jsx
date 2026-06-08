import React, { useContext, useState } from 'react';
import './Registration.scss';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InputField from '../InputField';
import PasswordField from '../PasswordField';
import Checkbox from '../Checkbox';
import Header from '../Header';
import AuthContext from '../../context/AuthContext';

const Registration = () => {
    const { user, register } = useContext(AuthContext);
    const { t } = useTranslation();
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    if (user) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const form = new FormData(e.target);
        const payload = {
            username: form.get('username'),
            email: form.get('email'),
            password: form.get('password'),
            passwordCopy: form.get('password_copy'),
            firstName: form.get('firstName') || undefined,
            lastName: form.get('lastName') || undefined
        };

        const termsAccepted = form.get('terms');
        const privacyAccepted = form.get('privacy');

        if (!termsAccepted || !privacyAccepted) {
            setError('Musisz zaakceptować Warunki Użytkowania i Politykę Prywatności');
            return;
        }

        if (payload.password !== payload.passwordCopy) {
            setError('Hasła nie są takie same');
            return;
        }

        try {
            await register(payload);
            navigate('/');
        } catch (err) {
            setError(err.data?.message || err.message || 'Błąd rejestracji');
        }
    };

    return (
        <div className="page-wrapper">
            <div className="layout-container">
                <Header/>

                <main className="main-card-registration">
                    {/* PageHeading */}
                    <div className="page-heading">
                        <div className="page-title-group">
                            <p className="page-title">{t('auth.create_account')}</p>
                            <p className="page-subtitle">{t('auth.register_subtitle')}</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form className="form-section" onSubmit={handleSubmit}>
                        {/* Required Fields */}
                        <InputField label={`${t('auth.username')} *`} placeholder="Wpisz nazwę użytkownika" name="username" required />
                        <InputField label="Adres e-mail *" placeholder={t('auth.email_placeholder')} type="email" name="email" required />

                        {/* Optional Fields */}
                        <div className="field-group">
                            <InputField label="Imię" placeholder={t('auth.first_name_placeholder')} name="firstName" />
                            <InputField label="Nazwisko" placeholder="Wpisz swoje nazwisko" name="lastName" />
                        </div>

                        <PasswordField label={`${t('auth.password')} *`} placeholder={t('auth.password_placeholder')} name="password" required />
                        <PasswordField label="Potwierdź hasło *" placeholder={t('auth.confirm_password_placeholder')} confirm name="password_copy" required />

                        <div className="flex flex-col gap-4">
                            <Checkbox name="terms" linkTo="/warunki">{t('auth.terms')}</Checkbox>
                            <Checkbox name="privacy" linkTo="/polityka">{t('auth.privacy')}</Checkbox>
                        </div>

                        {/* Submit Button */}
                        {error && <div className="error-message">{error}</div>}
                        <button className="submit-button" type="submit">{t('auth.register')}</button>
                    </form>
                    {/* Alternative Action Link */}
                    <div className="alt-action">
                        <p>
                            Masz już konto? <Link className="form-link" to="/login">{t('auth.login')}</Link>
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Registration;