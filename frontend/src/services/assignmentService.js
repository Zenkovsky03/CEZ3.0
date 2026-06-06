import request from './api';

export const getNearestAssignments = () =>
    request('/api/assignments/getNearestAssignments');

export const startAssignment = (assignmentId) =>
    request(`/api/assignments/${assignmentId}/start`, { method: 'POST' });

export const getQuizQuestions = (attemptId) =>
    request(`/api/assignments/${attemptId}/solve`);

export const saveSelection = (payload) =>
    request('/api/assignments/save-selection', {
        method: 'POST',
        body: JSON.stringify(payload)
    });

export const finishAttempt = (attemptId) =>
    request(`/api/assignments/${attemptId}/finish`, { method: 'POST' });

export const getResults = (assignmentId) =>
    request(`/api/assignments/${assignmentId}/results`);

export const submitHomework = (assignmentId, payload) =>
    request(`/api/assignments/${assignmentId}/submit-homework`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });

export const gradeHomework = (attemptId, payload) =>
    request(`/api/assignments/${attemptId}/grade`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });

export const getUngradedHomeworks = () =>
    request('/api/assignments/ungraded');
