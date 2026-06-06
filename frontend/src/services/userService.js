import request from './api';

export const getUsers = (pageNumber, pageSize) =>
    request(`/api/user/users?PageNumber=${pageNumber}&PageSize=${pageSize}`);

export const getAllUsers = () =>
    request('/api/user/users?PageNumber=1&PageSize=1000');

export const deleteUser = (id) =>
    request(`/api/user/${id}`, { method: 'DELETE' });

export const updateUser = (id, data) =>
    request(`/api/user/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });

export const updateUserRole = (id, role) =>
    request(`/api/user/${id}/role`, {
        method: 'PUT',
        body: JSON.stringify({ UserId: id, Role: role })
    });

export const blockUser = (id) =>
    request(`/api/user/block/${id}`, { method: 'PATCH' });

export const unblockUser = (id) =>
    request(`/api/user/unblock/${id}`, { method: 'PATCH' });

export const registerUser = (data) =>
    request('/api/user/register', {
        method: 'POST',
        body: JSON.stringify(data)
    });

export const getUsersByRole = (role) =>
    request(`/api/user/ByRole?r=${role}`);
