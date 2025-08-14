import { useEffect, useState } from "react";
import { api } from "../api";

export default function Friends() {
	const [friends, setFriends] = useState([]);
	const [username, setUsername] = useState("");
	const [error, setError] = useState(null);

	async function refresh() { setFriends(await api.friends.list()); }
	useEffect(() => { refresh().catch(()=>{}); }, []);

	async function add() {
		setError(null);
		try { await api.friends.add(username); setUsername(""); await refresh(); }
		catch (e) { setError(e.message); }
	}

	async function remove(u) {
		await api.friends.remove(u);
		await refresh();
	}

	return (
		<div className="container">
			<h2>Friends</h2>
			<div className="card">
				<label>Username<input value={username} onChange={(e)=>setUsername(e.target.value)} /></label>
				<button onClick={add}>Add Friend</button>
				{error && <p className="error">{error}</p>}
			</div>
			<ul>
				{friends.map((f)=> (
					<li key={f.username}>{f.username} <button onClick={()=>remove(f.username)}>Remove</button></li>
				))}
			</ul>
		</div>
	);
}
