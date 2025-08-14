import { useEffect, useState } from "react";
import { api } from "../api";

export default function Wishlist() {
	const [items, setItems] = useState([]);
	const [form, setForm] = useState({ name: "", price: 0, place: "", remarks: "" });

	async function refresh() { setItems(await api.wishlist.list()); }
	useEffect(() => { refresh().catch(()=>{}); }, []);

	async function add() {
		await api.wishlist.add(form);
		setForm({ name: "", price: 0, place: "", remarks: "" });
		await refresh();
	}
	async function remove(id) { await api.wishlist.remove(id); await refresh(); }

	return (
		<div className="container">
			<h2>Wishlist</h2>
			<div className="card">
				<label>Name<input value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} /></label>
				<label>Price<input type="number" value={form.price} onChange={(e)=>setForm({ ...form, price: Number(e.target.value) })} /></label>
				<label>Place<input value={form.place} onChange={(e)=>setForm({ ...form, place: e.target.value })} /></label>
				<label>Remarks<input value={form.remarks} onChange={(e)=>setForm({ ...form, remarks: e.target.value })} /></label>
				<button onClick={add}>Add</button>
			</div>
			<ul>
				{items.map((w)=> (
					<li key={w.id}>
						<div className="card">
							<strong>{w.name}</strong> - {w.price} @ {w.place} <button onClick={()=>remove(w.id)}>Remove</button>
							{w.remarks && <div><em>{w.remarks}</em></div>}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
