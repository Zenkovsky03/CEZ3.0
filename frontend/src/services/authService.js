import request from './api';

export const login = (payload) =>
    request('/api/user/login', {
        method: 'POST',
        body: JSON.stringify(payload)
    });

export const register = (payload) =>
    request('/api/user/register', {
        method: 'POST',
        body: JSON.stringify(payload)
    });

export const getResetToken = (payload) =>
    request('/api/user/getreset', {
        method: 'POST',
        body: JSON.stringify(payload)
    });

export const resetPassword = (payload) =>
    request('/api/user/resetpassword', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
