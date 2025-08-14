import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const raw = localStorage.getItem('user');
		if (raw) {
			try { setUser(JSON.parse(raw)); } catch {}
		}
		setLoading(false);
	}, []);

	const value = useMemo(() => ({
		user,
		loading,
		async login(email, password) {
			const u = await api.auth.login(email, password);
			setUser(u);
			localStorage.setItem('user', JSON.stringify(u));
			return u;
		},
		async register(name, email, password) {
			const u = await api.auth.register(name, email, password);
			setUser(u);
			localStorage.setItem('user', JSON.stringify(u));
			return u;
		},
		logout() {
			setUser(null);
			localStorage.removeItem('user');
		}
	}), [user, loading]);

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}