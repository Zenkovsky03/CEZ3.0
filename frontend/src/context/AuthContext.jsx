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
        // assume backend returns { token, user }
        setUser({ ...data.user, token: data.token });
        return data;
    };

    const register = async (payload) => {
        const data = await authService.register(payload);
        // optionally auto-login after register if backend returns token
        if (data.token) {
            setUser({ ...data.user, token: data.token });
        }
        return data;
    };

    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
