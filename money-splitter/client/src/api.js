export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function request(path, options = {}) {
	const token = localStorage.getItem("token");
	const headers = {
		"Content-Type": "application/json",
		...(options.headers || {}),
	};
	if (token) headers["Authorization"] = `Bearer ${token}`;
	const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
	let data = {};
	try { data = await res.json(); } catch {}
	if (!res.ok) throw new Error(data.error || "Request failed");
	return data;
}

export const api = {
	auth: {
		register: (body) => request("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
		login: (body) => request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
		me: () => request("/api/auth/me"),
	},
	friends: {
		list: () => request("/api/friends"),
		add: (username) => request("/api/friends", { method: "POST", body: JSON.stringify({ username }) }),
		remove: (username) => request(`/api/friends/${encodeURIComponent(username)}`, { method: "DELETE" }),
	},
	history: {
		list: () => request("/api/history"),
		add: (payload) => request("/api/history", { method: "POST", body: JSON.stringify(payload) }),
	},
	split: {
		calculate: (payload) => request("/api/split/calculate", { method: "POST", body: JSON.stringify(payload) }),
	},
	wishlist: {
		list: () => request("/api/wishlist"),
		add: (payload) => request("/api/wishlist", { method: "POST", body: JSON.stringify(payload) }),
		remove: (id) => request(`/api/wishlist/${id}`, { method: "DELETE" }),
	},
};
