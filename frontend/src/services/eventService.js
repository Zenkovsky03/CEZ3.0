import request from './api';

export const getUserEvents = (pageNumber = 1, pageSize = 30) =>
    request(`/api/events/list?pageNumber=${pageNumber}&pageSize=${pageSize}`);

export const getEventById = (id) =>
    request(`/api/events/${id}`);

export const createEvent = (payload) =>
    request('/api/events/create', {
        method: 'POST',
        body: JSON.stringify(payload)
    });

export const updateEvent = (id, payload) =>
    request(`/api/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });

export const deleteEvent = (id) =>
    request(`/api/events/${id}`, { method: 'DELETE' });
