// filepath: services/userService.ts
import type { User } from "../models/user";
import { connectToDatabase } from "../lib/db";
import { compare, hash } from "bcryptjs";

export async function getUserByUsername(username: string): Promise<User | undefined> {
	const db = await connectToDatabase();
	return db.get<User>("SELECT * FROM users WHERE username = ?", username);
}

export async function createUser(username: string, hash: string, role: User["role"] = "user", fullName: string): Promise<number> {
	const db = await connectToDatabase();
	const result = await db.run("INSERT INTO users (username, password, role, fullname) VALUES (?, ?, ?, ?)", username, hash, role, fullName);
	return result.lastID!;
}

// new helper
export async function countUsers(): Promise<number> {
	const db = await connectToDatabase();
	const row = await db.get<{ count: number }>("SELECT COUNT(*) AS count FROM users");
	return row?.count ?? 0;
}

export async function getUserById(id: number): Promise<User | undefined> {
	const db = await connectToDatabase();
	return db.get<User>(
		`SELECT id, username, fullName, password, role,
            twoFactorEnabled, twoFactorSecret
     FROM users
     WHERE id = ?`,
		id
	);
}
/** Enable 2FA by storing the secret and flipping the flag */
export async function enableTwoFactor(userId: number, secret: string): Promise<void> {
	const db = await connectToDatabase();
	await db.run(`UPDATE users SET twoFactorEnabled = 1, twoFactorSecret = ? WHERE id = ?`, secret, userId);
}

export async function updateUserPassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
	const user = await getUserById(userId);
	if (!user) throw new Error("User not found");
	const ok = await compare(currentPassword, user.password);
	if (!ok) throw new Error("Current password is incorrect");
	const pwdHash = await hash(newPassword, 10);
	const db = await connectToDatabase();
	await db.run(`UPDATE users SET password = ? WHERE id = ?`, pwdHash, userId);
}

export async function deleteUser(userId: number): Promise<void> {
	const db = await connectToDatabase();
	await db.run(`DELETE FROM users WHERE id = ?`, userId);
}
