import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLoginForm } from './Users/components/ui';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loginData, setLoginData] = useState({ username: 'admin', password: 'Password123!' });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: loginData.username,
                    password: loginData.password
                }),
            });

            if (!response.ok) {
                throw new Error('Nieprawidłowe dane logowania');
            }

            const data = await response.json();

            if (data.token) {
                const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
                const userRole = tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
                    || tokenPayload['role']
                    || tokenPayload['Role'];

                const isAdmin = Array.isArray(userRole)
                    ? userRole.includes('Admin')
                    : userRole === 'Admin';

                if (!isAdmin) {
                    throw new Error('Brak uprawnień administratora');
                }

                localStorage.setItem('token', data.token);
                navigate('/admin/users');
            }
        } catch (err) {
            setError(err.message || 'Wystąpił błąd podczas logowania');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLoginForm 
            loginData={loginData}
            onInputChange={setLoginData}
            loading={loading}
            error={error}
            onSubmit={handleLogin}
        />
    );
};

export default AdminLoginPage;
