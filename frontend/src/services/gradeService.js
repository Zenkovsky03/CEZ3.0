import request from './api';

export const getMyGrades = (courseId) =>
    request(`/api/grades/my${courseId ? `?courseId=${courseId}` : ''}`);
