const apiBaseUrl = import.meta.env.VITE_BASE_API_URL || '';

const getToken = () => {
    const directToken = localStorage.getItem('token');
    if (directToken) return directToken;

    try {
        const rawUser = localStorage.getItem('auth_user');
        if (!rawUser) return null;
        const parsedUser = JSON.parse(rawUser);
        return parsedUser?.token || parsedUser?.Token || null;
    } catch {
        return null;
    }
};

async function request(path, options = {}) {
    const token = getToken();
    const headers = {
        ...(options.body && !(options.body instanceof FormData)
            ? { 'Content-Type': 'application/json' }
            : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
    };

    const response = await fetch(`${apiBaseUrl}${path}`, {
        ...options,
        headers
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message = data?.message || data?.Message || data?.title || `HTTP ${response.status}`;
        const error = new Error(message);
        error.status = response.status;
        error.payload = data;
        throw error;
    }

    return data;
}

export { getToken };
export default request;
