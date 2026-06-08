import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoginForm from './LoginForm.component';
import './LoginForm.scss';
import AuthContext from '../../context/AuthContext';

const LoginFormContainer = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.target);
        const loginValue = formData.get('email');
        const password = formData.get('password');

        try {
            const data = await login({ login: loginValue, password });

            if (data.token) {
                const payload = JSON.parse(atob(data.token.split('.')[1]));

                if (payload.role === 'Admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }
        } catch (err) {
            setError(err.message || t('auth.login_error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <LoginForm
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
        />
    );
};

export default LoginFormContainer;
