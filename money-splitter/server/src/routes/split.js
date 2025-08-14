import express from "express";
import { authMiddleware } from "../utils/auth.js";
import { readJson, writeJson, getDataFilePath } from "../utils/db.js";

const router = express.Router();
router.use(authMiddleware);

function computeSplit(totalAmount, participants) {
	const amount = Number(totalAmount);
	if (!Number.isFinite(amount) || amount <= 0) return { error: "invalid amount" };
	const unique = Array.from(new Set(participants)).filter(Boolean);
	if (unique.length === 0) return { error: "no participants" };
	const perHead = Math.floor((amount / unique.length) * 100) / 100;
	const remainder = Math.round((amount - perHead * unique.length) * 100) / 100;
	const result = unique.map((u, idx) => ({ username: u, share: perHead + (idx === 0 ? remainder : 0) }));
	return { perHead, remainder, items: result };
}

router.post("/calculate", async (req, res) => {
	const { amount, participants, description = "", remarks = "" } = req.body || {};
	const calc = computeSplit(amount, participants || []);
	if (calc.error) return res.status(400).json({ error: calc.error });

	// update wallets: only if all have enough money
	const usersPath = getDataFilePath(req.paths.DATA_DIR, "users");
	const users = await readJson(usersPath, []);
	// Ensure all users exist and have enough wallet
	for (const { username, share } of calc.items) {
		const user = users.find((u) => u.username === username);
		if (!user) return res.status(400).json({ error: `user ${username} not found` });
		if (user.wallet < share) return res.status(400).json({ error: `user ${username} has insufficient funds` });
	}
	// Deduct
	for (const { username, share } of calc.items) {
		const user = users.find((u) => u.username === username);
		user.wallet = Math.round((user.wallet - share) * 100) / 100;
	}
	await writeJson(usersPath, users);

	// Add to history for owner
	const historyPath = getDataFilePath(req.paths.DATA_DIR, "history");
	const all = await readJson(historyPath, []);
	all.unshift({
		id: `${Date.now()}`,
		ownerId: req.user.id,
		description,
		amount: Number(amount),
		participants: calc.items,
		remarks,
		createdAt: new Date().toISOString(),
	});
	await writeJson(historyPath, all);

	res.json({ ...calc, updatedWallets: users.map(({ id, username, wallet }) => ({ id, username, wallet })) });
});

export default router;
