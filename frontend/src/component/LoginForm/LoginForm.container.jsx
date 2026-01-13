import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm.component';
import './LoginForm.scss';

const LoginFormContainer = () => {
    const navigate = useNavigate();
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
        const login = formData.get('email');
        const password = formData.get('password');

        try {
            const response = await fetch('/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ login, password })
            });

            if (!response.ok) {
                throw new Error('Nieprawidłowy login lub hasło');
            }

            const data = await response.json();
            
            if (data.token) {
                localStorage.setItem('token', data.token);
                
                if (data.role === 'Admin') {
                    navigate('/admin/users');
                } else {
                    navigate('/');
                }
            }
        } catch (err) {
            setError(err.message || 'Wystąpił błąd podczas logowania');
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
