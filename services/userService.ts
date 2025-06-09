// filepath: services/userService.ts
import type { User } from "../models/user";
import { connectToDatabase } from "../lib/db";

export async function getUserByUsername(username: string): Promise<User | undefined> {
	const db = await connectToDatabase();
	return db.get<User>("SELECT * FROM users WHERE username = ?", username);
}

export async function createUser(username: string, hash: string, role: User["role"] = "user"): Promise<number> {
	const db = await connectToDatabase();
	const result = await db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", username, hash, role);
	return result.lastID!;
}

// new helper
export async function countUsers(): Promise<number> {
	const db = await connectToDatabase();
	const row = await db.get<{ count: number }>("SELECT COUNT(*) AS count FROM users");
	return row?.count ?? 0;
}
