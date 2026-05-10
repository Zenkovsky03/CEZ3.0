const { VITE_BASE_API_URL: baseUrl } = import.meta.env;

const normalizedBaseUrl = (baseUrl || '').replace(/\/$/, '');
const apiBase = normalizedBaseUrl ? `${normalizedBaseUrl}/api` : '/api';

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

const buildQueryString = (params = {}) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
            return;
        }

        query.set(key, String(value));
    });

    const queryString = query.toString();
    return queryString ? `?${queryString}` : '';
};

const parseResponse = async (response) => {
    if (response.status === 204) {
        return null;
    }

    const text = await response.text();
    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        return text;
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

    const response = await fetch(`${apiBase}${path}`, {
        ...options,
        method,
        headers
    });

    const data = await parseResponse(response);

    if (!response.ok) {
        const message = data?.message || data?.Message || `HTTP ${response.status}`;
        const error = new Error(message);
        error.status = response.status;
        error.payload = data;
        throw error;
    }

    return data;
}

export const getUsersPage = (params = {}) => request(`/user/users${buildQueryString(params)}`);

export const getAllUsers = (params = {}) => getUsersPage({ pageNumber: 1, pageSize: 1000, ...params });

export const createUser = (payload) => request('/user/register', {
    method: 'POST',
    body: JSON.stringify(payload)
});

export const updateUser = (userId, payload) => request(`/user/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
});

export const updateUserRole = (userId, role) => request(`/user/${userId}/role`, {
    method: 'PUT',
    body: JSON.stringify({ userId, role })
});

export const blockUser = (userId) => request(`/user/block/${userId}`, {
    method: 'PATCH'
});

export const unblockUser = (userId) => request(`/user/unblock/${userId}`, {
    method: 'PATCH'
});

export const deleteUser = (userId) => request(`/user/${userId}`, {
    method: 'DELETE'
});

export const getCourses = () => request('/courses');

export const updateCourse = (courseId, payload) => request(`/courses/${courseId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
});

export const deleteCourse = (courseId) => request(`/courses/${courseId}`, {
    method: 'DELETE'
});

export const getCourseSections = (courseId) => request(`/courses/${courseId}/sections`);

export const getStudentUsers = () => getAllUsers({ role: 'Student' });

export const getAnnouncements = (params = {}) => request(`/announcements/list${buildQueryString(params)}`);

export const getAnnouncementById = (announcementId) => request(`/announcements/${announcementId}`);

export const createAnnouncement = (payload) => request('/announcements/create', {
    method: 'POST',
    body: JSON.stringify(payload)
});

export const getDashboardSnapshot = async () => {
    const [usersResponse, courses] = await Promise.all([
        getAllUsers(),
        getCourses()
    ]);

    const users = usersResponse?.items || [];
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date(now);
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const activeUsers = users.filter((user) => user.isActive && !user.isBlocked);
    const blockedUsers = users.filter((user) => user.isBlocked);
    const newRegistrations = users.filter((user) => new Date(user.createdAt) >= thirtyDaysAgo);
    const previousRegistrations = users.filter((user) => {
        const createdAt = new Date(user.createdAt);
        return createdAt >= sixtyDaysAgo && createdAt < thirtyDaysAgo;
    });

    const activeCourses = courses.filter((course) => {
        const endDate = course.endDate ? new Date(course.endDate) : null;
        return !endDate || endDate >= now;
    });

    const completedCourses = courses.filter((course) => {
        const endDate = course.endDate ? new Date(course.endDate) : null;
        return endDate && endDate < now;
    });

    const maxParticipants = Math.max(...courses.map((course) => course.participantsCount || 0), 1);
    const topCourses = [...courses]
        .sort((left, right) => (right.participantsCount || 0) - (left.participantsCount || 0))
        .slice(0, 5)
        .map((course) => ({
            name: course.name,
            score: String(course.participantsCount || 0),
            progress: Math.max(8, Math.round(((course.participantsCount || 0) / maxParticipants) * 100))
        }));

    const weeklyActivity = [3, 2, 1, 0].map((weekOffset) => {
        const weekEnd = new Date(now);
        weekEnd.setDate(now.getDate() - weekOffset * 7);
        const weekStart = new Date(weekEnd);
        weekStart.setDate(weekStart.getDate() - 6);

        const userActivity = users.filter((user) => {
            const createdAt = new Date(user.createdAt);
            return createdAt >= weekStart && createdAt <= weekEnd;
        }).length;

        const courseActivity = courses.filter((course) => {
            const createdAt = new Date(course.createdAt || course.startDate);
            return createdAt >= weekStart && createdAt <= weekEnd;
        }).length;

        return {
            label: `Tydzień ${4 - weekOffset}`,
            value: userActivity + courseActivity
        };
    });

    const registrationChange = previousRegistrations.length === 0
        ? newRegistrations.length
        : Math.round(((newRegistrations.length - previousRegistrations.length) / previousRegistrations.length) * 100);

    return {
        users,
        courses,
        activeUsers,
        blockedUsers,
        newRegistrations,
        activeCourses,
        completedCourses,
        topCourses,
        weeklyActivity,
        kpis: [
            {
                id: 'users',
                label: 'Aktywni Użytkownicy',
                value: String(activeUsers.length),
                change: `${users.length ? Math.round((activeUsers.length / users.length) * 100) : 0}% kont aktywnych`,
                positive: true
            },
            {
                id: 'registrations',
                label: 'Nowe Rejestracje (30d)',
                value: String(newRegistrations.length),
                change: `${registrationChange >= 0 ? '+' : ''}${registrationChange}% vs poprzednie 30 dni`,
                positive: registrationChange >= 0
            },
            {
                id: 'courses',
                label: 'Aktywne Kursy',
                value: String(activeCourses.length),
                change: `${courses.length ? Math.round((activeCourses.length / courses.length) * 100) : 0}% kursów aktywnych`,
                positive: true
            },
            {
                id: 'completed',
                label: 'Ukończone Kursy',
                value: String(completedCourses.length),
                change: `${blockedUsers.length} zablokowanych kont`,
                positive: blockedUsers.length < users.length / 2
            }
        ]
    };
};

export default {
    getUsersPage,
    getAllUsers,
    createUser,
    updateUser,
    updateUserRole,
    blockUser,
    unblockUser,
    deleteUser,
    getCourses,
    updateCourse,
    deleteCourse,
    getCourseSections,
    getStudentUsers,
    getDashboardSnapshot
};