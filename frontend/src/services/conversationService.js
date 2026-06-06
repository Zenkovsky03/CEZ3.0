import { request } from './apiClient';

export const getConversations = () => request('/api/conversation');

export const getConversation = (id) => request(`/api/conversation/${id}`);

export const sendMessage = (id, content) =>
    request(`/api/conversation/${id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content })
    });
