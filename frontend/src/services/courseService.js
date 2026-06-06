const getToken = () => {
    const directToken = localStorage.getItem('token');
    if (directToken) {
        return directToken;
    }

    try {
        const rawUser = localStorage.getItem('auth_user');
        if (!rawUser) {
            return null;
        }
        const parsedUser = JSON.parse(rawUser);
        return parsedUser?.token || parsedUser?.Token || null;
    } catch {
        return null;
    }
};

async function request(path, options = {}) {
    const method = options.method || 'GET';
    const token = getToken();
    const headers = {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
    };

    const response = await fetch(path, {
        ...options,
        headers
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message = data?.message || data?.Message || `HTTP ${response.status}`;
        const error = new Error(message);
        error.status = response.status;
        error.payload = data;
        throw error;
    }

    return data;
}

export const getCourses = async () => {
    try {
        return await request('/api/courses');
    } catch (error) {
        if (error.status !== 404 && error.status !== 405) {
            throw error;
        }
        return [];
    }
};

export const getCourseById = (id) => request(`/api/courses/${id}`);

export const createCourse = async (payload) => {
    try {
        return await request('/api/courses/create', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    } catch (error) {
        if (error.status !== 404 && error.status !== 405) {
            throw error;
        }
    }

    return request('/api/courses', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
};

export const updateCourse = (id, payload) =>
    request(`/api/courses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });

export const getCourseParticipants = (id) =>
    request(`/api/courses/${id}/participants`);

export const addParticipantToCourse = async (courseId, userId) => {
    try {
        return await request(`/api/courses/${courseId}/participants`, {
            method: 'POST',
            body: JSON.stringify({ userId })
        });
    } catch (error) {
        if (error.status !== 404 && error.status !== 405) {
            throw error;
        }
    }

    return request(`/api/CourseEnrollment/${courseId}/enroll`, {
        method: 'POST',
        body: JSON.stringify({ password: null })
    });
};

export const removeParticipantFromCourse = async (courseId, userId) => {
    try {
        return await request(`/api/courses/${courseId}/participants/${userId}`, {
            method: 'DELETE'
        });
    } catch (error) {
        if (error.status !== 404 && error.status !== 405) {
            throw error;
        }
    }

    return request(`/api/CourseEnrollment/${courseId}/unenroll`, {
        method: 'POST',
        body: JSON.stringify({ userId })
    });
};

export const getCourseSections = (id) => request(`/api/courses/${id}/sections`);

export const deleteCourseSection = (sectionId) =>
    request(`/api/CourseSection/Delete/${sectionId}`, {
        method: 'DELETE'
    });

export const createCourseSection = (courseId, payload) =>
    request(`/api/CourseSection/${courseId}/Create`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
