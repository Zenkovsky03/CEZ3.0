import request from './api';

export const getConversations = () =>
    request('/api/conversation');

export const getConversationById = (id) =>
    request(`/api/conversation/${id}`);

export const startConversation = (payload) =>
    request('/api/conversation/start', {
        method: 'POST',
        body: JSON.stringify(payload)
    });

export const sendMessage = (conversationId, payload) =>
    request(`/api/conversation/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });

export const closeConversation = (conversationId) =>
    request(`/api/conversation/${conversationId}/close`, { method: 'PATCH' });
