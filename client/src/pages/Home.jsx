import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function HomePage() {
	const { user } = useAuth();
	const [friends, setFriends] = useState([]);
	const [title, setTitle] = useState('');
	const [totalAmount, setTotalAmount] = useState('');
	const [contributors, setContributors] = useState([]);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	useEffect(() => {
		async function load() {
			if (!user) return;
			const f = await api.friends.list(user.id);
			setFriends(f);
		}
		load();
	}, [user]);

	function toggleContributor(friend) {
		if (contributors.find(c => c.friendId === friend.id)) {
			setContributors(prev => prev.filter(c => c.friendId !== friend.id));
		} else {
			setContributors(prev => [...prev, { friendId: friend.id, name: friend.name, amount: 0 }]);
		}
	}

	const remaining = useMemo(() => {
		const total = Number(totalAmount) || 0;
		const sum = contributors.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
		return total - sum;
	}, [totalAmount, contributors]);

	async function submit() {
		setError('');
		setSuccess('');
		try {
			const payload = {
				title,
				totalAmount: Number(totalAmount),
				contributors: contributors.map(({ friendId, amount }) => ({ friendId, amount: Number(amount) || 0 }))
			};
			if (!payload.title || !Number.isFinite(payload.totalAmount)) throw new Error('Enter valid title and amount');
			await api.transactions.create(user.id, payload);
			setTitle('');
			setTotalAmount('');
			setContributors([]);
			setSuccess('Saved expense and updated wallet');
		} catch (e) {
			setError(e.message);
		}
	}

	return (
		<div className="container">
			<div className="card">
				<h2>Add Expense</h2>
				<label>
					<span>Title</span>
					<input value={title} onChange={e => setTitle(e.target.value)} placeholder="Dinner at Cafe" />
				</label>
				<label>
					<span>Total Amount (₹)</span>
					<input type="number" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} />
				</label>
				<div className="contributors">
					<p>Select contributors:</p>
					<div className="friend-grid">
						{friends.map(f => (
							<div key={f.id} className={`friend ${contributors.find(c => c.friendId === f.id) ? 'selected' : ''}`} onClick={() => toggleContributor(f)}>
								<span>{f.name}</span>
							</div>
						))}
					</div>
					{contributors.length > 0 && (
						<div className="contrib-inputs">
							{contributors.map((c, idx) => (
								<label key={c.friendId}>
									<span>{c.name} amount</span>
									<input type="number" value={c.amount} onChange={e => {
										const val = e.target.value;
										setContributors(prev => prev.map((pc, i) => i === idx ? { ...pc, amount: val } : pc));
									}} />
								</label>
							))}
							<p className={`remaining ${remaining === 0 ? 'ok' : ''}`}>Remaining to allocate: ₹{remaining.toFixed(2)}</p>
						</div>
					)}
				</div>
				{error && <p className="error">{error}</p>}
				{success && <p className="success">{success}</p>}
				<button onClick={submit}>Save Expense</button>
			</div>
		</div>
	);
}