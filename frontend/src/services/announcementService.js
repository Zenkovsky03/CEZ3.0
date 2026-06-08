import request from './api';

export const getAnnouncements = (pageNumber = 1, pageSize = 5) =>
    request(`/api/announcements/list?pageNumber=${pageNumber}&pageSize=${pageSize}`);

export const getAnnouncementById = (id) =>
    request(`/api/announcements/${id}`);

export const createAnnouncement = (payload) =>
    request('/api/announcements/create', {
        method: 'POST',
        body: JSON.stringify(payload)
    });

export const updateAnnouncement = (id, payload) =>
    request(`/api/announcements/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });

export const deleteAnnouncement = (id) =>
    request(`/api/announcements/${id}`, { method: 'DELETE' });
