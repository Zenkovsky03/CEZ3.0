import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../Layout/AdminLayout';
import { ErrorAlert, SuccessAlert, LoadingSpinner, Breadcrumb, ProfilePreview } from '../components/ui';
import { FormField, RoleSelect, StatusRadioGroup } from '../components/forms';
import '../AdminUsersPageNew.scss';

const EditUserPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [token] = useState(localStorage.getItem('token') || '');
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('Student');
    const [status, setStatus] = useState('Active');
    const [fieldErrors, setFieldErrors] = useState({});
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/admin/users');
            return;
        }
        
        const fetchUser = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(`/api/user/users?PageNumber=1&PageSize=1000`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Nie udało się pobrać danych użytkownika');
                }

                const data = await response.json();
                const foundUser = data.items?.find(u => u.id === id);
                
                if (!foundUser) {
                    throw new Error('Nie znaleziono użytkownika o podanym ID');
                }

                if (foundUser.role === 'Admin') {
                    throw new Error('Nie możesz edytować konta administratora');
                }

                setUser(foundUser);
                setFirstName(foundUser.firstName || '');
                setLastName(foundUser.lastName || '');
                setEmail(foundUser.email || '');
                setUsername(foundUser.username || '');
                setRole(foundUser.role || 'Student');
                setStatus(foundUser.isBlocked ? 'Blocked' : (foundUser.isActive ? 'Active' : 'Inactive'));
            } catch (err) {
                setError(err.message);
                console.error('Error fetching user:', err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchUser();
    }, [id, token, navigate]);
    
    useEffect(() => {
        if (!user) return;
        
        const hasModifications = 
            firstName !== (user.firstName || '') ||
            lastName !== (user.lastName || '') ||
            email !== (user.email || '') ||
            role !== (user.role || 'Student') ||
            status !== (user.isBlocked ? 'Blocked' : (user.isActive ? 'Active' : 'Inactive'));
        
        setHasChanges(hasModifications);
    }, [firstName, lastName, email, role, status, user]);
    
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasChanges && !saving) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasChanges, saving]);

    const validate = () => {
        const errors = {};
        
        if (!firstName || firstName.trim().length < 2) {
            errors.firstName = 'Imię musi mieć co najmniej 2 znaki';
        } else if (firstName.trim().length > 50) {
            errors.firstName = 'Imię nie może przekraczać 50 znaków';
        } else if (!/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/.test(firstName)) {
            errors.firstName = 'Imię może zawierać tylko litery, spacje i myślniki';
        }
        
        if (!lastName || lastName.trim().length < 2) {
            errors.lastName = 'Nazwisko musi mieć co najmniej 2 znaki';
        } else if (lastName.trim().length > 50) {
            errors.lastName = 'Nazwisko nie może przekraczać 50 znaków';
        } else if (!/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/.test(lastName)) {
            errors.lastName = 'Nazwisko może zawierać tylko litery, spacje i myślniki';
        }
        
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Nieprawidłowy adres e-mail';
        } else if (email.length > 100) {
            errors.email = 'Adres e-mail nie może przekraczać 100 znaków';
        }
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate()) {
            const firstErrorField = document.querySelector('.edit-user__input--error');
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstErrorField.focus();
            }
            return;
        }

        setSaving(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const updatedFirstName = firstName.trim();
            const updatedLastName = lastName.trim();
            const updatedEmail = email.trim();
            
            const basicInfoResponse = await fetch(`/api/user/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    UserId: id,
                    FirstName: updatedFirstName,
                    LastName: updatedLastName,
                    Email: updatedEmail
                })
            });

            if (!basicInfoResponse.ok) {
                let errorMessage = 'Nie udało się zaktualizować danych użytkownika';
                try {
                    const errorData = await basicInfoResponse.json();
                    errorMessage = errorData.message || errorData.Message || errorMessage;
                } catch {
                    const errorText = await basicInfoResponse.text();
                    errorMessage = errorText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            if (role !== user.role) {
                const roleResponse = await fetch(`/api/user/${id}/role`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        UserId: id,
                        Role: role
                    })
                });

                if (!roleResponse.ok) {
                    let errorMessage = 'Nie udało się zmienić roli użytkownika';
                    try {
                        const errorData = await roleResponse.json();
                        errorMessage = errorData.message || errorData.Message || errorMessage;
                    } catch {
                        const errorText = await roleResponse.text();
                        errorMessage = errorText || errorMessage;
                    }
                    throw new Error(errorMessage);
                }
            }

            const userWasBlocked = user.isBlocked;
            const shouldBeBlocked = status === 'Blocked';

            if (userWasBlocked && !shouldBeBlocked) {
                const unblockResponse = await fetch(`/api/user/unblock/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!unblockResponse.ok) {
                    let errorMessage = 'Nie udało się odblokować użytkownika';
                    try {
                        const errorData = await unblockResponse.json();
                        errorMessage = errorData.message || errorData.Message || errorMessage;
                    } catch {
                        const errorText = await unblockResponse.text();
                        errorMessage = errorText || errorMessage;
                    }
                    throw new Error(errorMessage);
                }
            } else if (!userWasBlocked && shouldBeBlocked) {
                const blockResponse = await fetch(`/api/user/block/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!blockResponse.ok) {
                    let errorMessage = 'Nie udało się zablokować użytkownika';
                    try {
                        const errorData = await blockResponse.json();
                        errorMessage = errorData.message || errorData.Message || errorMessage;
                    } catch {
                        const errorText = await blockResponse.text();
                        errorMessage = errorText || errorMessage;
                    }
                    throw new Error(errorMessage);
                }
            }

            setSuccessMessage('Zmiany zostały zapisane pomyślnie!');
            setHasChanges(false);
            
            setUser(prevUser => ({
                ...prevUser,
                firstName: updatedFirstName,
                lastName: updatedLastName,
                email: updatedEmail,
                role,
                isActive: status === 'Active',
                isBlocked: status === 'Blocked'
            }));
            
            setTimeout(() => {
                navigate('/admin/users');
            }, 2000);
        } catch (err) {
            setError(err.message);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/admin/users');
    };

    if (!token) return null;

    const breadcrumbItems = [
        { label: 'Użytkownicy', onClick: () => navigate('/admin/users') },
        { label: 'Edycja', isActive: false },
        { label: `${firstName} ${lastName}`, isActive: true }
    ];

    return (
        <AdminLayout onLogout={handleLogout}>
            <div className="admin-users__edit-user__container">
                {loading ? (
                    <div className="admin-users__edit-user__loading">
                        <LoadingSpinner />
                    </div>
                ) : error && !user ? (
                    <div className="admin-users__edit-user__error-page">
                        <span className="material-symbols-outlined">error</span>
                        <p>{error}</p>
                        <button onClick={() => navigate('/admin/users')}>
                            Powrót do listy użytkowników
                        </button>
                    </div>
                ) : (
                    <>
                        <Breadcrumb items={breadcrumbItems} />

                        <div className="admin-users__edit-user__header">
                            <div>
                                <h1>Edycja użytkownika</h1>
                                <p>Zaktualizuj informacje o użytkowniku</p>
                            </div>
                            <button
                                onClick={() => navigate('/admin/users')}
                                className="admin-users__edit-user__back-btn"
                            >
                                <span className="material-symbols-outlined">arrow_back</span>
                                <span>Powrót</span>
                            </button>
                        </div>

                        {successMessage && <SuccessAlert message={successMessage} />}
                        {error && <ErrorAlert message={error} />}

                        <div className="admin-users__edit-user__layout">
                            <div className="admin-users__edit-user__main">
                                <form onSubmit={handleSubmit}>
                                    {/* Personal Data Section */}
                                    <div className="admin-users__edit-user__section">
                                        <h2 className="admin-users__edit-user__section-title">
                                            <span className="material-symbols-outlined">person</span>
                                            Dane osobowe
                                        </h2>
                                        
                                        <div className="admin-users__edit-user__form-grid">
                                            <FormField
                                                label="Imię *"
                                                name="firstName"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                error={fieldErrors.firstName}
                                                placeholder="Jan"
                                            />

                                            <FormField
                                                label="Nazwisko *"
                                                name="lastName"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                error={fieldErrors.lastName}
                                                placeholder="Kowalski"
                                            />

                                            <FormField
                                                label="Email *"
                                                name="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                error={fieldErrors.email}
                                                placeholder="jan.kowalski@example.com"
                                            />

                                            <FormField
                                                label="Nazwa użytkownika"
                                                name="username"
                                                value={username}
                                                disabled={true}
                                                helperText="Nie można edytować nazwy użytkownika"
                                            />
                                        </div>
                                    </div>

                                    {/* Account Settings Section */}
                                    <div className="admin-users__edit-user__section">
                                        <h2 className="admin-users__edit-user__section-title">
                                            <span className="material-symbols-outlined">settings</span>
                                            Ustawienia konta
                                        </h2>
                                        
                                        <div className="admin-users__edit-user__form-grid">
                                            <RoleSelect
                                                value={role}
                                                onChange={(e) => setRole(e.target.value)}
                                            />

                                            <StatusRadioGroup
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="admin-users__edit-user__actions">
                                        <button
                                            type="button"
                                            onClick={() => navigate('/admin/users')}
                                            className="admin-users__edit-user__cancel-btn"
                                            disabled={saving}
                                        >
                                            <span className="material-symbols-outlined">close</span>
                                            <span>Anuluj</span>
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="admin-users__edit-user__save-btn"
                                        >
                                            {saving ? (
                                                <>
                                                    <div className="loading-spinner__spinner"></div>
                                                    <span>Zapisywanie...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined">save</span>
                                                    <span>Zapisz zmiany</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <ProfilePreview
                                user={user}
                                role={role}
                                status={status}
                                firstName={firstName}
                                lastName={lastName}
                                username={username}
                            />
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default EditUserPage;
