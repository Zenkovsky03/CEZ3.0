import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../Layout/AdminLayout';
import { ErrorAlert, SuccessAlert, LoadingSpinner, Breadcrumb, ProfilePreview } from '../components/ui';
import { FormField, RoleSelect, StatusRadioGroup } from '../components/forms';
import { getAllUsers, updateUser, updateUserRole, blockUser, unblockUser, registerUser } from '../../../../services/userService';
import '../AdminUsersPageNew.scss';

const EditUserPage = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const isNewUser = id === 'new';
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(!isNewUser);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('Student');
    const [status, setStatus] = useState('Active');
    const [fieldErrors, setFieldErrors] = useState({});
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (isNewUser) return;
        
        const fetchUser = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const data = await getAllUsers();
                const foundUser = data.items?.find(u => u.id === id);
                
                if (!foundUser) {
                    throw new Error(t('Nie znaleziono użytkownika o podanym ID'));
                }

                if (foundUser.role === 'Admin') {
                    throw new Error(t('Nie możesz edytować konta administratora'));
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
            } finally {
                setLoading(false);
            }
        };
        
        fetchUser();
    }, [id, navigate, isNewUser, t]);
    
    useEffect(() => {
        if (!user) return;
        
        const hasModifications = 
            firstName !== (user.firstName || '') ||
            lastName !== (user.lastName || '') ||
            email !== (user.email || '') ||
            role !== (user.role || 'Student') ||
            status !== (user.isBlocked ? 'Blocked' : (user.isActive ? 'Active' : 'Inactive'));
        
        setHasChanges(hasModifications);
    }, [firstName, lastName, email, role, status, user, isNewUser]);
    
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
            errors.firstName = t('Imię musi mieć co najmniej 2 znaki');
        } else if (firstName.trim().length > 50) {
            errors.firstName = t('Imię nie może przekraczać 50 znaków');
        } else if (!/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/.test(firstName)) {
            errors.firstName = t('Imię może zawierać tylko litery, spacje i myślniki');
        }
        
        if (!lastName || lastName.trim().length < 2) {
            errors.lastName = t('Nazwisko musi mieć co najmniej 2 znaki');
        } else if (lastName.trim().length > 50) {
            errors.lastName = t('Nazwisko nie może przekraczać 50 znaków');
        } else if (!/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/.test(lastName)) {
            errors.lastName = t('Nazwisko może zawierać tylko litery, spacje i myślniki');
        }
        
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = t('Nieprawidłowy adres e-mail');
        } else if (email.length > 100) {
            errors.email = t('Adres e-mail nie może przekraczać 100 znaków');
        }

        if (isNewUser) {
            if (!password || password.length < 6) {
                errors.password = t('Hasło musi mieć co najmniej 6 znaków');
            } else if (password.length > 100) {
                errors.password = t('Hasło nie może przekraczać 100 znaków');
            }
            if (password !== confirmPassword) {
                errors.confirmPassword = t('Hasła nie są zgodne');
            }
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

            if (isNewUser) {
                await registerUser({
                    FirstName: updatedFirstName,
                    LastName: updatedLastName,
                    Email: updatedEmail,
                    Login: username || updatedEmail,
                    Password: password,
                    ConfirmPassword: confirmPassword,
                    Role: role
                });

                setSuccessMessage(t('Użytkownik został utworzony pomyślnie!'));
                setTimeout(() => {
                    navigate('/admin/users');
                }, 2000);
                return;
            }
            
            await updateUser(id, {
                UserId: id,
                FirstName: updatedFirstName,
                LastName: updatedLastName,
                Email: updatedEmail
            });

            if (role !== user.role) {
                await updateUserRole(id, role);
            }

            const userWasBlocked = user.isBlocked;
            const shouldBeBlocked = status === 'Blocked';

            if (userWasBlocked && !shouldBeBlocked) {
                await unblockUser(id);
            } else if (!userWasBlocked && shouldBeBlocked) {
                await blockUser(id);
            }

            setSuccessMessage(t('Zmiany zostały zapisane pomyślnie!'));
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
        localStorage.removeItem('auth_user');
        navigate('/admin');
    };

    const breadcrumbItems = isNewUser
        ? [
            { label: t('admin.users'), onClick: () => navigate('/admin/users') },
            { label: t('Dodawanie'), isActive: true }
        ]
        : [
            { label: t('admin.users'), onClick: () => navigate('/admin/users') },
            { label: t('Edycja'), isActive: false },
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
                            {t('Powrót do listy użytkowników')}
                        </button>
                    </div>
                ) : (
                    <>
                        <Breadcrumb items={breadcrumbItems} />

                        <div className="admin-users__edit-user__header">
                            <div>
                                <h1>{isNewUser ? t('admin.adding_user') : t('admin.editing_user')}</h1>
                                <p>{isNewUser ? t('admin.create_account') : t('admin.update_user_info')}</p>
                            </div>
                            <button
                                onClick={() => navigate('/admin/users')}
                                className="admin-users__edit-user__back-btn"
                            >
                                <span className="material-symbols-outlined">arrow_back</span>
                                <span>{t('common.back')}</span>
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
                                            {t('Dane osobowe')}
                                        </h2>
                                        
                                        <div className="admin-users__edit-user__form-grid">
                                            <FormField
                                                label={t('user.first_name')}
                                                name="firstName"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                error={fieldErrors.firstName}
                                                placeholder="Jan"
                                            />

                                            <FormField
                                                label={t('Nazwisko *')}
                                                name="lastName"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                error={fieldErrors.lastName}
                                                placeholder="Kowalski"
                                            />

                                            <FormField
                                                label={t('Email *')}
                                                name="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                error={fieldErrors.email}
                                                placeholder="jan.kowalski@example.com"
                                            />

                                            <FormField
                                                label={t('user.username_label')}
                                                name="username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                disabled={!isNewUser}
                                                helperText={isNewUser ? t('Opcjonalnie, domyślnie email') : t('Nie można edytować nazwy użytkownika')}
                                            />
                                        </div>
                                    </div>

                                    {/* Account Settings Section */}
                                    <div className="admin-users__edit-user__section">
                                        <h2 className="admin-users__edit-user__section-title">
                                            <span className="material-symbols-outlined">settings</span>
                                            {t('Ustawienia konta')}
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

                                    {isNewUser && (
                                        <div className="admin-users__edit-user__section">
                                            <h2 className="admin-users__edit-user__section-title">
                                                <span className="material-symbols-outlined">lock</span>
                                                {t('Hasło')}
                                            </h2>
                                            <div className="admin-users__edit-user__form-grid">
                                                <FormField
                                                    label={t('user.password')}
                                                    name="password"
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    error={fieldErrors.password}
                                                    placeholder={t('auth.min_chars')}
                                                />
                                                <FormField
                                                    label={t('user.confirm_password')}
                                                    name="confirmPassword"
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    error={fieldErrors.confirmPassword}
                                                    placeholder={t('auth.confirm_password_placeholder')}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="admin-users__edit-user__actions">
                                        <button
                                            type="button"
                                            onClick={() => navigate('/admin/users')}
                                            className="admin-users__edit-user__cancel-btn"
                                            disabled={saving}
                                        >
                                            <span className="material-symbols-outlined">close</span>
                                            <span>{t('common.cancel')}</span>
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="admin-users__edit-user__save-btn"
                                        >
                                            {saving ? (
                                                <>
                                                    <div className="loading-spinner__spinner"></div>
                                                    <span>{t('common.saving')}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined">save</span>
                                                    <span>{isNewUser ? t('admin.create_user') : t('admin.save_changes')}</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {user && (
                                <ProfilePreview
                                    user={user}
                                    role={role}
                                    status={status}
                                    firstName={firstName}
                                    lastName={lastName}
                                    username={username}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default EditUserPage;
