import { SignJWT, jwtVerify } from "jose";
import type { User } from "../models/user";

if (!process.env.JWT_SECRET) {
	throw new Error("Missing env var JWT_SECRET");
}
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function signJwt(payload: { userId: number; username: string; role: User["role"] }): Promise<string> {
	return await new SignJWT(payload).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime("1h").sign(SECRET);
}

export async function verifyJwt(token: string) {
	const { payload } = await jwtVerify(token, SECRET);
	return payload as {
		userId: number;
		username: string;
		role: User["role"];
		iat: number;
		exp: number;
	};
}

export async function getUserRoleFromToken(token: string): Promise<User["role"] | null> {
	try {
		const decoded = await verifyJwt(token);
		console.log("Decoded JWT:", decoded.role);
		return decoded.role;
	} catch (err) {
		console.error("Invalid token:", err);
		return null;
	}
}
