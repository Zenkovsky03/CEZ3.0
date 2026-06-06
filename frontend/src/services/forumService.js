import request from './api';

export const getThreadHeaders = (pageNumber = 1, pageSize = 10) =>
    request(`/api/thread/headers?pageNumber=${pageNumber}&pageSize=${pageSize}`);

export const getThreadById = (threadId, pageNumber = 1, pageSize = 10) =>
    request(`/api/thread/${threadId}?pageNumber=${pageNumber}&pageSize=${pageSize}`);

export const createThread = (payload) =>
    request('/api/thread/create', {
        method: 'POST',
        body: JSON.stringify(payload)
    });

export const closeThread = (threadId) =>
    request(`/api/thread/${threadId}/close`, { method: 'POST' });

export const deleteThread = (threadId) =>
    request(`/api/thread/${threadId}/delete`, { method: 'POST' });

export const editThread = (threadId, payload) =>
    request(`/api/thread/${threadId}/edit`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });

export const createReply = (payload) =>
    request('/api/thread/replay/create', {
        method: 'POST',
        body: JSON.stringify(payload)
    });

export const deleteReply = (replyId) =>
    request(`/api/thread/replay/${replyId}`, { method: 'DELETE' });

export const editReply = (replyId, payload) =>
    request(`/api/thread/replay/${replyId}/edit`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
