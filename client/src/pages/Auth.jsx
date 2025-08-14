import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
	const { login, register } = useAuth();
	const [mode, setMode] = useState('login');
	const [form, setForm] = useState({ name: '', email: '', password: '' });
	const [error, setError] = useState('');
	const navigate = useNavigate();

	async function handleSubmit(e) {
		e.preventDefault();
		setError('');
		try {
			if (mode === 'login') {
				await login(form.email, form.password);
			} else {
				await register(form.name, form.email, form.password);
			}
			navigate('/');
		} catch (err) {
			setError(err.message);
		}
	}

	return (
		<div className="container auth">
			<div className="card">
				<h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
				<form onSubmit={handleSubmit}>
					{mode === 'register' && (
						<label>
							<span>Name</span>
							<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
						</label>
					)}
					<label>
						<span>Email</span>
						<input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
					</label>
					<label>
						<span>Password</span>
						<input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
					</label>
					{error && <p className="error">{error}</p>}
					<button type="submit">{mode === 'login' ? 'Login' : 'Create account'}</button>
				</form>
				<button className="link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
					{mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Login'}
				</button>
			</div>
		</div>
	);
}