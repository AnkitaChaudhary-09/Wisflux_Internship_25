import express from "express";
import { authMiddleware } from "../utils/auth.js";
import { readJson, writeJson, getDataFilePath } from "../utils/db.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
	const path = getDataFilePath(req.paths.DATA_DIR, "friends");
	const all = await readJson(path, []);
	const list = all.filter((f) => f.ownerId === req.user.id);
	res.json(list);
});

router.post("/", async (req, res) => {
	const { username } = req.body || {};
	if (!username) return res.status(400).json({ error: "username is required" });
	const path = getDataFilePath(req.paths.DATA_DIR, "friends");
	const all = await readJson(path, []);
	if (all.find((f) => f.ownerId === req.user.id && f.username === username)) {
		return res.status(409).json({ error: "already a friend" });
	}
	all.push({ id: `${req.user.id}:${username}`, ownerId: req.user.id, username });
	await writeJson(path, all);
	res.status(201).json({ ok: true });
});

router.delete("/:username", async (req, res) => {
	const { username } = req.params;
	const path = getDataFilePath(req.paths.DATA_DIR, "friends");
	const all = await readJson(path, []);
	const next = all.filter((f) => !(f.ownerId === req.user.id && f.username === username));
	await writeJson(path, next);
	res.json({ ok: true });
});

export default router;
