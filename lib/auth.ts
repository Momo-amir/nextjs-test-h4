import { sign, verify } from "jsonwebtoken";
import type { User } from "../models/user";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export function signJwt(payload: { userId: number; username: string; role: User["role"] }) {
	return sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyJwt(token: string) {
	return verify(token, JWT_SECRET) as {
		userId: number;
		username: string;
		role: User["role"];
		iat: number;
		exp: number;
	};
}
export function getUserRoleFromToken(token: string): User["role"] | null {
	try {
		const decoded = verifyJwt(token);
		return decoded.role;
	} catch (error) {
		console.error("Invalid token:", error);
		return null;
	}
}
