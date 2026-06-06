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
