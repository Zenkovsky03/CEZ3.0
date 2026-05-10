import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import '../../AdminUsersPageNew.scss';

const initialFormData = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    passwordCopy: ''
};

const CreateUserModal = ({ show, loading, error, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(initialFormData);
    const [localError, setLocalError] = useState('');

    useEffect(() => {
        if (show) {
            setFormData(initialFormData);
            setLocalError('');
        }
    }, [show]);

    if (!show) return null;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (formData.password !== formData.passwordCopy) {
            setLocalError('Hasła nie są takie same');
            return;
        }

        setLocalError('');
        await onSubmit({
            firstName: formData.firstName || undefined,
            lastName: formData.lastName || undefined,
            username: formData.username,
            email: formData.email,
            password: formData.password
        });
    };

    return createPortal(
        <div className="admin-users__create-modal">
            <div className="admin-users__create-modal-backdrop" onClick={onCancel}></div>
            <div className="admin-users__create-modal-content">
                <div className="admin-users__create-modal-body">
                    <h2 className="admin-users__create-modal-title">Dodaj użytkownika</h2>
                    <p className="admin-users__create-modal-subtitle">Nowe konto zostanie utworzone jako student.</p>

                    {(localError || error) && (
                        <div className="admin-users__create-modal-error">
                            {localError || error}
                        </div>
                    )}

                    <form className="admin-users__create-modal-form" onSubmit={handleSubmit}>
                        <div className="admin-users__create-modal-grid">
                            <label className="admin-users__create-modal-field">
                                <span>Imię</span>
                                <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" />
                            </label>
                            <label className="admin-users__create-modal-field">
                                <span>Nazwisko</span>
                                <input name="lastName" value={formData.lastName} onChange={handleChange} type="text" />
                            </label>
                        </div>

                        <label className="admin-users__create-modal-field">
                            <span>Nazwa użytkownika</span>
                            <input name="username" value={formData.username} onChange={handleChange} type="text" required />
                        </label>

                        <label className="admin-users__create-modal-field">
                            <span>Email</span>
                            <input name="email" value={formData.email} onChange={handleChange} type="email" required />
                        </label>

                        <div className="admin-users__create-modal-grid">
                            <label className="admin-users__create-modal-field">
                                <span>Hasło</span>
                                <input name="password" value={formData.password} onChange={handleChange} type="password" required />
                            </label>
                            <label className="admin-users__create-modal-field">
                                <span>Powtórz hasło</span>
                                <input name="passwordCopy" value={formData.passwordCopy} onChange={handleChange} type="password" required />
                            </label>
                        </div>

                        <div className="admin-users__create-modal-actions">
                            <button type="button" className="admin-users__create-modal-btn admin-users__create-modal-btn--secondary" onClick={onCancel} disabled={loading}>
                                Anuluj
                            </button>
                            <button type="submit" className="admin-users__create-modal-btn admin-users__create-modal-btn--primary" disabled={loading}>
                                {loading ? 'Zapisywanie...' : 'Utwórz użytkownika'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CreateUserModal;