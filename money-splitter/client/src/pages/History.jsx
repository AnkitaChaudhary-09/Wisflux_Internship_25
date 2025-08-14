import { useEffect, useState } from "react";
import { api } from "../api";

export default function History() {
	const [items, setItems] = useState([]);
	useEffect(() => { api.history.list().then(setItems).catch(()=>{}); }, []);
	return (
		<div className="container">
			<h2>History</h2>
			<ul>
				{items.map((h)=> (
					<li key={h.id}>
						<div className="card">
							<strong>{h.description}</strong> - {h.amount}
							<div>Participants: {h.participants.map(p=> `${p.username || p} (${p.share || })`).join(", ")}</div>
							<div>{new Date(h.createdAt).toLocaleString()}</div>
							{h.remarks && <em>{h.remarks}</em>}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
