import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

export async function connectToDatabase(): Promise<Database> {
	const db = await open({
		filename: "./dev.db",
		driver: sqlite3.Database,
	});

	// Create users table if it doesn't exist, adding a role column.
	await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            fullName TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'user',
            twoFactorEnabled BOOLEAN NOT NULL DEFAULT 0,
            twoFactorSecret TEXT
        );
    `);

	return db;
}
