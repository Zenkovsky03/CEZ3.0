const apiBaseUrl = import.meta.env.VITE_BASE_API_URL || '';

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

export async function getUserEvents(pageNumber = 1, pageSize = 30) {
    const token = getToken();
    const response = await fetch(
        `${apiBaseUrl}/api/events/list?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const error = new Error(data.message || data.Message || 'Nie udało się pobrać wydarzeń.');
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}

export default { getUserEvents };