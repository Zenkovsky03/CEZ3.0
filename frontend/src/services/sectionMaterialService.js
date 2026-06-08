import request from './api';

export const getLessonById = (id) =>
    request(`/api/SectionMaterial/${id}`);

export const getCurrentLesson = (courseSectionId) =>
    request(`/api/SectionMaterial/current/${courseSectionId}`);

export const getLessonAttachments = (lessonId) =>
    request(`/api/LessonAttachment/lessons/${lessonId}/attachments`);

export const getCourseSections = (courseId) =>
    request(`/api/CourseSection/${courseId}/sections`);

export const getSectionById = (sectionId) =>
    request(`/api/CourseSection/${sectionId}`);

export const markLessonComplete = (sectionId) =>
    request(`/api/CourseSection/Finalize/${sectionId}`, { method: 'POST' });

export const createLesson = (payload) =>
    request('/api/SectionMaterial', {
        method: 'POST',
        body: JSON.stringify(payload)
    });

export const updateLesson = (id, payload) =>
    request(`/api/SectionMaterial/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });

export const deleteLesson = (id) =>
    request(`/api/SectionMaterial/${id}`, { method: 'DELETE' });

export const addAttachment = (lessonId, payload) =>
    request(`/api/LessonAttachment/lessons/${lessonId}/attachments`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });

export const deleteAttachment = (id) =>
    request(`/api/LessonAttachment/attachments/${id}`, { method: 'DELETE' });

export const getMaterialsBySection = (sectionId) =>
    request(`/api/SectionMaterial/by-section/${sectionId}`);
