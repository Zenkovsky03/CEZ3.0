const apiBaseUrl = import.meta.env.VITE_BASE_API_URL || '';

export const getToken = () => {
    const directToken = localStorage.getItem('token');
    if (directToken) return directToken;
    try {
        const raw = localStorage.getItem('auth_user');
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed?.token || parsed?.Token || null;
    } catch {
        return null;
    }
};

export async function request(path, options = {}) {
    const token = getToken();
    const headers = {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
    };
    const response = await fetch(`${apiBaseUrl}${path}`, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        const error = new Error(data.message || data.Message || `HTTP ${response.status}`);
        error.status = response.status;
        throw error;
    }
    return data;
}
