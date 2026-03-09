import React, { createContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const raw = localStorage.getItem('auth_user');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });


    useEffect(() => {
        if (user) localStorage.setItem('auth_user', JSON.stringify(user));
        else localStorage.removeItem('auth_user');
    }, [user]);

    const login = async (credentials) => {
        const data = await authService.login(credentials);
        // Backend returns { token } - decode user info from JWT
        if (data.token) {
            localStorage.setItem('token', data.token);
            try {
                const payload = JSON.parse(atob(data.token.split('.')[1]));
                setUser({
                    id: payload.nameid || payload.sub || payload.id,
                    email: payload.email,
                    username: payload.unique_name || payload.username,
                    firstName: payload.given_name || payload.firstName,
                    lastName: payload.family_name || payload.lastName,
                    role: payload.role,
                    token: data.token
                });
            } catch {
                setUser({ token: data.token });
            }
        }
        return data;
    };

    const register = async (payload) => {
        // Backend returns { message } - no auto-login after register
        return await authService.register(payload);;
    };

    const logout = () => setUser(null);
    useEffect(() => {
        if (!user) {
            localStorage.removeItem('token');
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
