import { useState } from "react";
import { useAuth } from "../auth";

export default function Login() {
	const { login, register } = useAuth();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [wallet, setWallet] = useState(100);
	const [mode, setMode] = useState("login");
	const [error, setError] = useState(null);

	async function handleSubmit(e) {
		e.preventDefault();
		setError(null);
		try {
			if (mode === "login") await login(username, password);
			else await register(username, password, Number(wallet));
		} catch (e) {
			setError(e.message);
		}
	}

	return (
		<div className="container">
			<h2>{mode === "login" ? "Login" : "Register"}</h2>
			<form onSubmit={handleSubmit} className="card">
				<label>Username<input value={username} onChange={(e)=>setUsername(e.target.value)} /></label>
				<label>Password<input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} /></label>
				{mode === "register" && (
					<label>Initial Wallet<input type="number" value={wallet} onChange={(e)=>setWallet(e.target.value)} /></label>
				)}
				<button type="submit">{mode === "login" ? "Login" : "Create account"}</button>
			</form>
			<button onClick={()=>setMode(mode === "login" ? "register" : "login")}>Switch to {mode === "login" ? "Register" : "Login"}</button>
			{error && <p className="error">{error}</p>}
		</div>
	);
}
