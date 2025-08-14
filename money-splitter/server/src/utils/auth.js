import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export function signToken(payload) {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
	return jwt.verify(token, JWT_SECRET);
}

export function hashPassword(plain) {
	return bcrypt.hashSync(plain, 10);
}

export function comparePassword(plain, hash) {
	return bcrypt.compareSync(plain, hash);
}

export function authMiddleware(req, res, next) {
	const header = req.headers.authorization || "";
	const token = header.startsWith("Bearer ") ? header.slice(7) : null;
	if (!token) return res.status(401).json({ error: "Missing token" });
	try {
		const data = verifyToken(token);
		req.user = data;
		next();
	} catch (e) {
		return res.status(401).json({ error: "Invalid token" });
	}
}
