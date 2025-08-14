import express from "express";
import { authMiddleware } from "../utils/auth.js";
import { readJson, writeJson, getDataFilePath } from "../utils/db.js";
import { v4 as uuid } from "uuid";

const router = express.Router();
router.use(authMiddleware);

router.get("/", async (req, res) => {
	const all = await readJson(getDataFilePath(req.paths.DATA_DIR, "wishlist"), []);
	res.json(all.filter((w) => w.ownerId === req.user.id));
});

router.post("/", async (req, res) => {
	const { name, price = 0, place = "", remarks = "" } = req.body || {};
	if (!name) return res.status(400).json({ error: "name required" });
	const path = getDataFilePath(req.paths.DATA_DIR, "wishlist");
	const all = await readJson(path, []);
	const item = { id: uuid(), ownerId: req.user.id, name, price: Number(price), place, remarks, createdAt: new Date().toISOString() };
	all.unshift(item);
	await writeJson(path, all);
	res.status(201).json(item);
});

router.delete("/:id", async (req, res) => {
	const { id } = req.params;
	const path = getDataFilePath(req.paths.DATA_DIR, "wishlist");
	const all = await readJson(path, []);
	await writeJson(path, all.filter((w) => !(w.ownerId === req.user.id && w.id === id)));
	res.json({ ok: true });
});

export default router;
