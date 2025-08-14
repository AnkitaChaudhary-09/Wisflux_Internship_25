import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function Navbar() {
	const { user, logout } = useAuth();
	const [balance, setBalance] = useState(null);

	useEffect(() => {
		let mounted = true;
		async function load() {
			if (user) {
				try {
					const w = await api.wallet.get(user.id);
					if (mounted) setBalance(w.balance);
				} catch {
					if (mounted) setBalance(null);
				}
			} else {
				setBalance(null);
			}
		}
		load();
		return () => { mounted = false; };
	}, [user]);

	return (
		<header className="nav">
			<Link to="/" className="brand">SplitPay</Link>
			<nav className="links">
				<NavLink to="/" end>Home</NavLink>
				<NavLink to="/friends">Friends</NavLink>
				<NavLink to="/history">History</NavLink>
			</nav>
			<div className="right">
				{user ? (
					<>
						<span className="wallet">Wallet: <strong>{balance === null ? '—' : `₹${balance.toFixed(2)}`}</strong></span>
						<button className="outline" onClick={logout}>Logout</button>
					</>
				) : (
					<NavLink to="/auth">Login</NavLink>
				)}
			</div>
		</header>
	);
}