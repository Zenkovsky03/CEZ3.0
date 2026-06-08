import request from './api';

export const getMyGrades = (courseId) =>
    request(`/api/grades/my${courseId ? `?courseId=${courseId}` : ''}`);

export const getCourseGrades = (courseId) =>
    request(`/api/grades/course/${courseId}`);
