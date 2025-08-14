import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function FriendsPage() {
	const { user } = useAuth();
	const [friends, setFriends] = useState([]);
	const [form, setForm] = useState({ name: '', email: '' });
	const [error, setError] = useState('');

	async function load() {
		if (!user) return;
		const list = await api.friends.list(user.id);
		setFriends(list);
	}

	useEffect(() => { load(); }, [user]);

	async function addFriend(e) {
		e.preventDefault();
		setError('');
		try {
			await api.friends.add(user.id, form);
			setForm({ name: '', email: '' });
			await load();
		} catch (e) {
			setError(e.message);
		}
	}

	async function removeFriend(id) {
		await api.friends.remove(user.id, id);
		await load();
	}

	return (
		<div className="container">
			<div className="card">
				<h2>Friends</h2>
				<form onSubmit={addFriend} className="row">
					<input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
					<input placeholder="Email (optional)" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
					<button type="submit">Add</button>
				</form>
				{error && <p className="error">{error}</p>}
				<ul className="list">
					{friends.map(f => (
						<li key={f.id} className="list-item">
							<div>
								<strong>{f.name}</strong>
								{f.email && <span className="muted"> — {f.email}</span>}
							</div>
							<button className="danger" onClick={() => removeFriend(f.id)}>Remove</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}