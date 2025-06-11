import { Database } from "sqlite";
import { connectToDatabase } from "../lib/db";
import { compare, hash } from "bcryptjs";

import * as userService from "../services/userService";

// mock sqlite connection - this is a fake in-memory DB
jest.mock("../lib/db", () => ({
	connectToDatabase: jest.fn(),
}));
// mock bcrypt methods - we don't want to actually hash passwords in tests because it would be slow and unnecessary
jest.mock("bcryptjs", () => ({
	compare: jest.fn(),
	hash: jest.fn(),
}));

// our fake sqlite DB
const mockDb: Partial<Database> = {
	get: jest.fn(),
	run: jest.fn(),
};
// before each test, reset the mock DB and connectToDatabase so we get a fresh instance
beforeEach(() => {
	jest.clearAllMocks();
	(connectToDatabase as jest.Mock).mockResolvedValue(mockDb as Database);
});

test("getUserByUsername calls db.get with correct query", async () => {
	(mockDb.get as jest.Mock).mockResolvedValue({
		id: 1,
		username: "john",
		password: "hashed",
		fullName: "John Doe",
		role: "user",
	});

	const user = await userService.getUserByUsername("john");
	expect(mockDb.get).toHaveBeenCalledWith("SELECT * FROM users WHERE username = ?", "john");
	expect(user?.username).toBe("john");
});

test("createUser inserts and returns lastID", async () => {
	(mockDb.run as jest.Mock).mockResolvedValue({ lastID: 42 });
	const newId = await userService.createUser("alice", "pwHash", "admin", "Alice A");
	expect(mockDb.run).toHaveBeenCalledWith("INSERT INTO users (username, password, role, fullname) VALUES (?, ?, ?, ?)", "alice", "pwHash", "admin", "Alice A");
	expect(newId).toBe(42);
});

test("countUsers returns count from db", async () => {
	(mockDb.get as jest.Mock).mockResolvedValue({ count: 7 }); // mock the count result
	const cnt = await userService.countUsers(); // we call the countUsers function that we use to check if we should create an admin user
	expect(mockDb.get).toHaveBeenCalledWith("SELECT COUNT(*) AS count FROM users"); // should query the count
	expect(cnt).toBe(7); // should return the count from the mock
});

// Test for getUserById.
// This function is a later implementation, I realized that I had only been using getUserByUsername.
// In a real project I would use this for a lot of what I use getUserByUsername for.
// I used the other because it was easy to use since I had to check usernames for uniqueness on registration.
test("getUserById queries correct fields", async () => {
	const fake = {
		id: 2,
		username: "bob",
		fullName: "Bob B",
		password: "hpwd",
		role: "user",
		twoFactorEnabled: 0,
		twoFactorSecret: null,
	};
	(mockDb.get as jest.Mock).mockResolvedValue(fake);

	const user = await userService.getUserById(2);
	expect(mockDb.get).toHaveBeenCalledWith(
		`SELECT id, username, fullName, password, role,
            twoFactorEnabled, twoFactorSecret
     FROM users
     WHERE id = ?`,
		2
	);
	expect(user).toEqual(fake);
});

test("enableTwoFactor updates twoFactor fields", async () => {
	await userService.enableTwoFactor(5, "SECRET123");
	expect(mockDb.run).toHaveBeenCalledWith(`UPDATE users SET twoFactorEnabled = 1, twoFactorSecret = ? WHERE id = ?`, "SECRET123", 5);
});

// Tests for updateUserPassword actually not yet implemented in the frontend as of yet
describe("updateUserPassword", () => {
	const userRec = { id: 3, password: "oldHash" };

	it("throws when user not found", async () => {
		(mockDb.get as jest.Mock).mockResolvedValue(undefined);
		await expect(userService.updateUserPassword(3, "old", "new")).rejects.toThrow("User not found");
	});

	it("throws when current password is wrong", async () => {
		(mockDb.get as jest.Mock).mockResolvedValue(userRec);
		(compare as jest.Mock).mockResolvedValue(false);
		await expect(userService.updateUserPassword(3, "bad", "new")).rejects.toThrow("Current password is incorrect");
		expect(compare).toHaveBeenCalledWith("bad", "oldHash");
	});

	it("updates password when compare passes", async () => {
		(mockDb.get as jest.Mock).mockResolvedValue(userRec);
		(compare as jest.Mock).mockResolvedValue(true);
		(hash as jest.Mock).mockResolvedValue("newHash");
		await userService.updateUserPassword(3, "old", "newPwd");
		expect(compare).toHaveBeenCalledWith("old", "oldHash");
		expect(hash).toHaveBeenCalledWith("newPwd", 10);
		expect(mockDb.run).toHaveBeenCalledWith(`UPDATE users SET password = ? WHERE id = ?`, "newHash", 3);
	});
});

test("deleteUser calls db.run with DELETE", async () => {
	await userService.deleteUser(9);
	expect(mockDb.run).toHaveBeenCalledWith(`DELETE FROM users WHERE id = ?`, 9);
});
