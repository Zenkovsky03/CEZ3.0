import React from 'react';
import './Registration.scss';
import { Link } from 'react-router-dom';
import InputField from '../InputField';
import PasswordField from '../PasswordField';
import Checkbox from '../Checkbox';
import Header from '../Header';

const Registration = () => {
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
                    <div className="form-section">
                        {/* Name Fields */}
                        <div className="field-group">
                            <InputField label="Imię" placeholder="Wpisz swoje imię" name={"name"} />
                            <InputField label="Nazwisko" placeholder="Wpisz swoje nazwisko" name={"surname"}/>
                        </div>

                        <InputField label="Adres e-mail" placeholder="email@example.com" type="email" />

                        {/* User Type Field */}
                        <div className="field-label">
                            <p>Typ konta</p>
                            <div className="type-grid">
                                <label className="type-option-label">
                                    <input className="form-radio" name="user_type" type="radio" value="student" defaultChecked/>
                                    <span className="text-sm font-medium">Student</span>
                                </label>
                                <label className="type-option-label">
                                    <input className="form-radio" name="user_type" type="radio" value="teacher" />
                                    <span className="text-sm font-medium">Nauczyciel</span>
                                </label>
                            </div>
                        </div>

                        <PasswordField label="Hasło" placeholder="Wpisz swoje hasło" name={"password"} />
                        <PasswordField label="Potwierdź hasło" placeholder="Potwierdź swoje hasło" confirm name={"password_copy"} />

                        <div className="flex flex-col gap-4">
                            <Checkbox linkTo="/warunki">Warunki Użytkowania</Checkbox>
                            <Checkbox linkTo="/polityka">Politykę Prywatności</Checkbox>
                        </div>

                        {/* Submit Button */}
                        <button className="submit-button" type="submit">Zarejestruj się</button>

                        {/* Alternative Action Link */}
                        <div className="alt-action">
                            <p>
                                Masz już konto? <Link className="form-link" to="/login">Zaloguj się</Link>
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Registration;