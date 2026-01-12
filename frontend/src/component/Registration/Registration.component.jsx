import React, { useContext, useState } from 'react';
import './Registration.scss';
import { Link } from 'react-router-dom';
import InputField from '../InputField';
import PasswordField from '../PasswordField';
import Checkbox from '../Checkbox';
import Header from '../Header';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
    const { register } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
                            <p className="page-title">Utwórz konto</p>
                            <p className="page-subtitle">Dołącz do naszej społeczności i rozpocznij naukę.</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form className="form-section" onSubmit={handleSubmit}>
                        {/* Required Fields */}
                        <InputField label="Nazwa użytkownika *" placeholder="Wpisz nazwę użytkownika" name="username" required />
                        <InputField label="Adres e-mail *" placeholder="email@example.com" type="email" name="email" required />

                        {/* Optional Fields */}
                        <div className="field-group">
                            <InputField label="Imię" placeholder="Wpisz swoje imię" name="firstName" />
                            <InputField label="Nazwisko" placeholder="Wpisz swoje nazwisko" name="lastName" />
                        </div>

                        <PasswordField label="Hasło *" placeholder="Wpisz swoje hasło" name="password" required />
                        <PasswordField label="Potwierdź hasło *" placeholder="Potwierdź swoje hasło" confirm name="password_copy" required />

                        <div className="flex flex-col gap-4">
                            <Checkbox name="terms" linkTo="/warunki">Warunki Użytkowania</Checkbox>
                            <Checkbox name="privacy" linkTo="/polityka">Politykę Prywatności</Checkbox>
                        </div>

                        {/* Submit Button */}
                        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
                        <button className="submit-button" type="submit">Zarejestruj się</button>
                    </form>
                    {/* Alternative Action Link */}
                    <div className="alt-action">
                        <p>
                            Masz już konto? <Link className="form-link" to="/login">Zaloguj się</Link>
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Registration;