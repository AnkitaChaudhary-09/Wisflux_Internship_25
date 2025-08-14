import express from "express";
import cors from "cors";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./routes/auth.js";
import friendsRouter from "./routes/friends.js";
import historyRouter from "./routes/history.js";
import splitRouter from "./routes/split.js";
import wishlistRouter from "./routes/wishlist.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../data");

const app = express();
app.use(cors());
app.use(express.json());

// Ensure data files exist with sane defaults
const dataFiles = [
	{ name: "users.json", defaultContent: [] },
	{ name: "friends.json", defaultContent: [] },
	{ name: "history.json", defaultContent: [] },
	{ name: "wishlist.json", defaultContent: [] },
];

async function ensureDataFiles() {
	await Promise.all(
		dataFiles.map(async ({ name, defaultContent }) => {
			const filePath = path.join(DATA_DIR, name);
			try {
				await readFile(filePath, "utf8");
			} catch {
				await writeFile(filePath, JSON.stringify(defaultContent, null, 2));
			}
		})
	);
}

app.use((req, res, next) => {
	req.paths = { DATA_DIR };
	next();
});

app.use("/api/auth", authRouter);
app.use("/api/friends", friendsRouter);
app.use("/api/history", historyRouter);
app.use("/api/split", splitRouter);
app.use("/api/wishlist", wishlistRouter);

app.get("/api/health", (_req, res) => {
	res.json({ ok: true });
});

const PORT = process.env.PORT || 4000;
ensureDataFiles().then(() => {
	app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
