import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function HistoryPage() {
	const { user } = useAuth();
	const [transactions, setTransactions] = useState([]);

	useEffect(() => {
		async function load() {
			if (!user) return;
			const list = await api.transactions.list(user.id);
			setTransactions(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
		}
		load();
	}, [user]);

	return (
		<div className="container">
			<div className="card">
				<h2>History</h2>
				<ul className="list">
					{transactions.map(t => (
						<li key={t.id} className="list-item">
							<div className="col">
								<strong>{t.title}</strong>
								<span className="muted"> — {new Date(t.createdAt).toLocaleString()}</span>
							</div>
							<div className="col">
								<span>₹{t.totalAmount.toFixed(2)}</span>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}