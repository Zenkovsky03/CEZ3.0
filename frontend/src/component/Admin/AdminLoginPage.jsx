import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLoginForm } from './Users/components/ui';
import AuthContext from '../../context/AuthContext';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const { login, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loginData, setLoginData] = useState({ username: '', password: '' });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await login({ login: loginData.username, password: loginData.password });

            if (data.token) {
                const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
                const userRole = tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
                    || tokenPayload['role']
                    || tokenPayload['Role'];

                const isAdmin = Array.isArray(userRole)
                    ? userRole.includes('Admin')
                    : userRole === 'Admin';

                if (!isAdmin) {
                    logout();
                    throw new Error('Brak uprawnień administratora');
                }

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
