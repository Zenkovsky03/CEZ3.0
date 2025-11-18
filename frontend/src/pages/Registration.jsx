import React from 'react';
import './Registration.css';
import { Link } from 'react-router-dom';

const Logo = () => (
    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" fill="currentColor"></path>
    </svg>
);

const InputField = ({ label, placeholder, type = 'text' }) => (
    <label className="field-label">
        <p className="input-label-text">{label}</p>
        <input className="form-input" placeholder={placeholder} type={type} />
    </label>
);

const PasswordField = ({ label, placeholder, confirm = false }) => (
    <label className="input-label">
        <p className="input-label-text">{label}</p>
        <div className="password-container">
            <input className="form-input password-input" placeholder={placeholder} type="password" />
            {!confirm && (
                <button className="toggle-password" type="button">
                    <span className="material-symbols-outlined text-xl">visibility_off</span>
                </button>
            )}
        </div>
    </label>
);

// Komponent Checkbox dla warunków
const Checkbox = ({ children, linkTo = "#" }) => (
    <label className="terms-checkbox-label">
        <input className="form-checkbox mt-05" type="checkbox" />
        <span className="terms-text">
            Akceptuję <Link className="form-link" to={linkTo}>{children}</Link>.
        </span>
    </label>
);

const Registration = () => {
    return (
        <div className="page-wrapper">
            <div className="layout-container">
                {/* TopNavBar */}
                <header className="top-navbar">
                    <div className="logo-container">
                        <div className="logo-icon"><Logo /></div>
                        <h1 className="logo-title">CEZ 3.0</h1>
                    </div>
                </header>

                <main className="main-card-registration">
                    {/* PageHeading */}
                    <div className="page-heading">
                        <div className="page-title-group">
                            <p className="page-title">Utwórz konto</p>
                            <p className="page-subtitle">Dołącz do naszej społeczności i rozpocznij naukę.</p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="form-section">
                        {/* Name Fields */}
                        <div className="field-group">
                            <InputField label="Imię" placeholder="Wpisz swoje imię" />
                            <InputField label="Nazwisko" placeholder="Wpisz swoje nazwisko" />
                        </div>

                        <InputField label="Adres e-mail" placeholder="email@example.com" type="email" />

                        {/* User Type Field */}
                        <div className="field-label">
                            <p>Typ konta</p>
                            <div className="type-grid">
                                <label className="type-option-label">
                                    <input className="form-radio" name="user_type" type="radio" value="student" />
                                    <span className="text-sm font-medium">Student</span>
                                </label>
                                <label className="type-option-label">
                                    <input className="form-radio" name="user_type" type="radio" value="teacher" />
                                    <span className="text-sm font-medium">Nauczyciel</span>
                                </label>
                            </div>
                        </div>

                        <PasswordField label="Hasło" placeholder="Wpisz swoje hasło" />
                        <PasswordField label="Potwierdź hasło" placeholder="Potwierdź swoje hasło" confirm />

                        {/* Terms and Conditions */}
                        <div className="flex flex-col gap-4">
                            <Checkbox linkTo="/warunki">Warunki Użytkowania</Checkbox>
                            <Checkbox linkTo="/polityka">Politykę Prywatności</Checkbox>
                        </div>

                        {/* Submit Button */}
                        <button className="submit-button" type="submit">Zarejestruj się</button>

                        {/* Alternative Action Link */}
                        <div className="alt-action">
                            <p>
                                Masz już konto? <Link className="form-link" to="/logowanie">Zaloguj się</Link>
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Registration;