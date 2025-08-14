const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function request(path, options = {}) {
	const response = await fetch(`${API_BASE}${path}`, {
		headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
		credentials: 'omit',
		...options
	});
	if (!response.ok) {
		let message = `HTTP ${response.status}`;
		try { const data = await response.json(); message = data.message || message; } catch {}
		throw new Error(message);
	}
	try { return await response.json(); } catch { return null; }
}

export const api = {
	auth: {
		login: (email, password) => request('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
		register: (name, email, password) => request('/api/register', { method: 'POST', body: JSON.stringify({ name, email, password }) })
	},
	friends: {
		list: (userId) => request(`/api/users/${userId}/friends`),
		add: (userId, friend) => request(`/api/users/${userId}/friends`, { method: 'POST', body: JSON.stringify(friend) }),
		remove: (userId, friendId) => request(`/api/users/${userId}/friends/${friendId}`, { method: 'DELETE' })
	},
	wallet: {
		get: (userId) => request(`/api/users/${userId}/wallet`),
		adjust: (userId, amount) => request(`/api/users/${userId}/wallet/adjust`, { method: 'POST', body: JSON.stringify({ amount }) })
	},
	transactions: {
		list: (userId) => request(`/api/users/${userId}/transactions`),
		create: (userId, payload) => request(`/api/users/${userId}/transactions`, { method: 'POST', body: JSON.stringify(payload) })
	}
};

export default api;