import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { useAuth } from "../auth";

export default function Home() {
	const { user, setUser } = useAuth();
	const [amount, setAmount] = useState(0);
	const [description, setDescription] = useState("");
	const [remarks, setRemarks] = useState("");
	const [friends, setFriends] = useState([]);
	const [selected, setSelected] = useState([]);
	const [result, setResult] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => { api.friends.list().then(setFriends).catch(()=>{}); }, []);

	const participants = useMemo(() => Array.from(new Set([user?.username, ...selected].filter(Boolean))), [user, selected]);

	async function calculate() {
		setError(null);
		try {
			const r = await api.split.calculate({ amount: Number(amount), participants, description, remarks });
			setResult(r);
			// update wallet in UI if present
			if (r.updatedWallets) {
				const me = r.updatedWallets.find(u => u.username === user.username);
				if (me) setUser({ ...user, wallet: me.wallet });
			}
		} catch (e) { setError(e.message); }
	}

	return (
		<div className="container">
			<h2>Money Splitter</h2>
			<p>Wallet: <strong>{user?.wallet?.toFixed ? user.wallet.toFixed(2) : user?.wallet}</strong></p>
			<div className="card">
				<label>Description<input value={description} onChange={(e)=>setDescription(e.target.value)} /></label>
				<label>Total Amount<input type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} /></label>
				<label>Remarks<input value={remarks} onChange={(e)=>setRemarks(e.target.value)} /></label>
				<label>Participants</label>
				<div className="chips">
					{friends.map((f)=> (
						<label key={f.username} className="chip">
							<input type="checkbox" checked={selected.includes(f.username)} onChange={(e)=>{
								setSelected((cur)=> e.target.checked ? [...cur, f.username] : cur.filter(x=>x!==f.username));
							}} /> {f.username}
						</label>
					))}
				</div>
				<button onClick={calculate}>Calculate & Deduct</button>
				{error && <p className="error">{error}</p>}
			</div>

			{result && (
				<div className="card">
					<h3>Split Result</h3>
					<p>Per Person: {result.perHead} | Remainder: {result.remainder}</p>
					<ul>
						{result.items.map((i)=> (
							<li key={i.username}>{i.username}: {i.share}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
