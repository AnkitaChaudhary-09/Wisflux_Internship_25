import { readFile, writeFile } from "fs/promises";
import path from "path";

export async function readJson(filePath, defaultValue) {
	try {
		const data = await readFile(filePath, "utf8");
		return JSON.parse(data || "null") ?? defaultValue;
	} catch {
		return defaultValue;
	}
}

export async function writeJson(filePath, data) {
	const content = JSON.stringify(data, null, 2);
	await writeFile(filePath, content);
}

export function getDataFilePath(DATA_DIR, name) {
	return path.join(DATA_DIR, `${name}.json`);
}
