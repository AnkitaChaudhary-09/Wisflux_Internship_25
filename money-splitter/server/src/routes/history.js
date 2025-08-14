import express from "express";
import { authMiddleware } from "../utils/auth.js";
import { readJson, writeJson, getDataFilePath } from "../utils/db.js";
import { v4 as uuid } from "uuid";

const router = express.Router();
router.use(authMiddleware);

router.get("/", async (req, res) => {
	const all = await readJson(getDataFilePath(req.paths.DATA_DIR, "history"), []);
	res.json(all.filter((h) => h.ownerId === req.user.id));
});

router.post("/", async (req, res) => {
	const { description, amount, participants, remarks } = req.body || {};
	if (!description || !amount || !Array.isArray(participants) || participants.length === 0) {
		return res.status(400).json({ error: "description, amount, participants required" });
	}
	const entry = {
		id: uuid(),
		ownerId: req.user.id,
		description,
		amount: Number(amount),
		participants,
		remarks: remarks || "",
		createdAt: new Date().toISOString(),
	};
	const path = getDataFilePath(req.paths.DATA_DIR, "history");
	const all = await readJson(path, []);
	all.unshift(entry);
	await writeJson(path, all);
	res.status(201).json(entry);
});

export default router;
