import request from './api';

export const getCourses = () => request('/api/courses');
export const getCourseById = (id) => request(`/api/courses/${id}`);
export const createCourse = (payload) =>
    request('/api/courses/create', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
export const updateCourse = (id, payload) =>
    request(`/api/courses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
export const getCourseParticipants = (id) =>
    request(`/api/CourseEnrollment/${id}/GetEnrollStudents`);
export const addParticipantToCourse = (courseId) =>
    request(`/api/CourseEnrollment/${courseId}/enroll`, {
        method: 'POST',
        body: JSON.stringify({ password: null })
    });
export const removeParticipantFromCourse = (courseId) =>
    request(`/api/CourseEnrollment/${courseId}/unenroll`, {
        method: 'POST'
    });
export const getCourseSections = (id) => request(`/api/courses/${id}/sections`);
export const deleteCourseSection = (sectionId) =>
    request(`/api/CourseSection/Delete/${sectionId}`, { method: 'DELETE' });
export const createCourseSection = (courseId, payload) =>
    request(`/api/CourseSection/${courseId}/Create`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
export const getCourseProgress = (id) => request(`/api/courses/${id}/progress`);
export const getNearestAssignments = () =>
    request('/api/assignments/getNearestAssignments');
