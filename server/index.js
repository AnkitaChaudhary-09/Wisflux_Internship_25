import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'db.json');

function ensureDb() {
	if (!fs.existsSync(dataDir)) {
		fs.mkdirSync(dataDir, { recursive: true });
	}
	if (!fs.existsSync(dbPath)) {
		const initial = {
			users: [],
			friends: [],
			transactions: [],
			wallets: []
		};
		fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2));
	}
}

function readDb() {
	ensureDb();
	const raw = fs.readFileSync(dbPath, 'utf-8');
	return JSON.parse(raw);
}

function writeDb(db) {
	fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

// Auth (simple, demo only)
app.post('/api/register', (req, res) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
	const db = readDb();
	if (db.users.find(u => u.email === email)) return res.status(409).json({ message: 'Email exists' });
	const user = { id: uuidv4(), name, email, password };
	db.users.push(user);
	writeDb(db);
	res.json({ id: user.id, name: user.name, email: user.email });
});

app.post('/api/login', (req, res) => {
	const { email, password } = req.body;
	const db = readDb();
	const user = db.users.find(u => u.email === email && u.password === password);
	if (!user) return res.status(401).json({ message: 'Invalid credentials' });
	res.json({ id: user.id, name: user.name, email: user.email });
});

// Friends
app.get('/api/users/:userId/friends', (req, res) => {
	const db = readDb();
	const friends = db.friends.filter(f => f.userId === req.params.userId);
	res.json(friends);
});

app.post('/api/users/:userId/friends', (req, res) => {
	const { name, email } = req.body;
	if (!name) return res.status(400).json({ message: 'Name required' });
	const db = readDb();
	const friend = { id: uuidv4(), userId: req.params.userId, name, email: email || '' };
	db.friends.push(friend);
	writeDb(db);
	res.status(201).json(friend);
});

app.delete('/api/users/:userId/friends/:friendId', (req, res) => {
	const db = readDb();
	db.friends = db.friends.filter(f => !(f.userId === req.params.userId && f.id === req.params.friendId));
	writeDb(db);
	res.status(204).end();
});

// Wallet
app.get('/api/users/:userId/wallet', (req, res) => {
	const db = readDb();
	let wallet = db.wallets.find(w => w.userId === req.params.userId);
	if (!wallet) {
		wallet = { userId: req.params.userId, balance: 0 };
		db.wallets.push(wallet);
		writeDb(db);
	}
	res.json(wallet);
});

app.post('/api/users/:userId/wallet/adjust', (req, res) => {
	const { amount } = req.body;
	if (typeof amount !== 'number') return res.status(400).json({ message: 'Amount must be number' });
	const db = readDb();
	let wallet = db.wallets.find(w => w.userId === req.params.userId);
	if (!wallet) {
		wallet = { userId: req.params.userId, balance: 0 };
		db.wallets.push(wallet);
	}
	wallet.balance += amount;
	writeDb(db);
	res.json(wallet);
});

// Transactions (expenses with friend contributions)
app.get('/api/users/:userId/transactions', (req, res) => {
	const db = readDb();
	const tx = db.transactions.filter(t => t.userId === req.params.userId);
	res.json(tx);
});

app.post('/api/users/:userId/transactions', (req, res) => {
	const { title, totalAmount, contributors } = req.body; // contributors: [{ friendId, amount }]
	if (!title || typeof totalAmount !== 'number') return res.status(400).json({ message: 'Invalid payload' });
	const db = readDb();
	const id = uuidv4();
	const transaction = {
		id,
		userId: req.params.userId,
		title,
		totalAmount,
		contributors: Array.isArray(contributors) ? contributors : [],
		createdAt: new Date().toISOString()
	};
	db.transactions.push(transaction);
	// Decrease wallet by totalAmount
	let wallet = db.wallets.find(w => w.userId === req.params.userId);
	if (!wallet) {
		wallet = { userId: req.params.userId, balance: 0 };
		db.wallets.push(wallet);
	}
	wallet.balance -= totalAmount;
	writeDb(db);
	res.status(201).json(transaction);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
	console.log(`API server running on http://localhost:${PORT}`);
});