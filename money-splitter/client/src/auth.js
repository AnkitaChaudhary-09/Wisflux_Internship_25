import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		(async () => {
			try {
				if (localStorage.getItem("token")) {
					const me = await api.auth.me();
					setUser(me.user);
				}
			} catch {}
			setLoading(false);
		})();
	}, []);

	const login = async (username, password) => {
		const { token, user } = await api.auth.login({ username, password });
		localStorage.setItem("token", token);
		setUser(user);
	};

	const register = async (username, password, wallet) => {
		const { token, user } = await api.auth.register({ username, password, wallet });
		localStorage.setItem("token", token);
		setUser(user);
	};

	const logout = () => {
		localStorage.removeItem("token");
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
