const { VITE_BASE_API_URL: baseUrl } = import.meta.env;

const normalizedBaseUrl = (baseUrl || '').replace(/\/$/, '');
const apiBase = normalizedBaseUrl ? `${normalizedBaseUrl}/api` : '/api';

async function request(path, body) {
    const res = await fetch(`${apiBase}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const err = new Error(data.message || 'Request failed');
        err.status = res.status;
        err.data = data;
        throw err;
    }
    return data;
}

export async function login({ login, password }) {
    return request('/user/login', { login, password });
}

export async function register(payload) {
    return request('/user/register', payload);
}

export default { login, register };
