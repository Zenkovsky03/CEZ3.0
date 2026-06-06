import { request } from './apiClient';

export const getThreads = () => request('/api/thread/headers');

export const getThread = (id) => request(`/api/thread/${id}`);

export const createReply = (threadId, content) =>
    request('/api/thread/replay', {
        method: 'POST',
        body: JSON.stringify({ threadId, content })
    });

export const closeThread = (id) =>
    request(`/api/thread/${id}/close`, { method: 'POST' });
