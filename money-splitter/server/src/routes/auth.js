import express from "express";
import { readJson, writeJson, getDataFilePath } from "../utils/db.js";
import { hashPassword, comparePassword, signToken } from "../utils/auth.js";
import { v4 as uuid } from "uuid";

const router = express.Router();

router.post("/register", async (req, res) => {
	const { username, password, wallet = 0 } = req.body || {};
	if (!username || !password) return res.status(400).json({ error: "username and password are required" });
	const usersPath = getDataFilePath(req.paths.DATA_DIR, "users");
	const users = await readJson(usersPath, []);
	if (users.find((u) => u.username === username)) return res.status(409).json({ error: "username taken" });
	const newUser = { id: uuid(), username, passwordHash: hashPassword(password), wallet: Number(wallet) || 0 };
	users.push(newUser);
	await writeJson(usersPath, users);
	const token = signToken({ id: newUser.id, username: newUser.username });
	res.json({ token, user: { id: newUser.id, username: newUser.username, wallet: newUser.wallet } });
});

router.post("/login", async (req, res) => {
	const { username, password } = req.body || {};
	if (!username || !password) return res.status(400).json({ error: "username and password are required" });
	const users = await readJson(getDataFilePath(req.paths.DATA_DIR, "users"), []);
	const user = users.find((u) => u.username === username);
	if (!user || !comparePassword(password, user.passwordHash)) return res.status(401).json({ error: "invalid credentials" });
	const token = signToken({ id: user.id, username: user.username });
	res.json({ token, user: { id: user.id, username: user.username, wallet: user.wallet } });
});

router.get("/me", async (req, res) => {
	const auth = req.headers.authorization || "";
	const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
	if (!token) return res.status(401).json({ error: "Missing token" });
	try {
		const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString("utf8"));
		res.json({ token, user: { id: payload.id, username: payload.username } });
	} catch {
		res.status(401).json({ error: "Invalid token" });
	}
});

export default router;
