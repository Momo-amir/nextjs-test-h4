import { jest } from "@jest/globals";
import type { Database } from "sqlite";
import * as dbModule from "../lib/db";
import * as bcrypt from "bcryptjs";
import { getUserByUsername, createUser, countUsers, getUserById, enableTwoFactor, updateUserPassword, deleteUser } from "./userService";

// replace auto‐mock with a manual factory so connectToDatabase is a jest.fn()
// jest.mock("../lib/db", () => ({
//   connectToDatabase: jest.fn(),
// }));
jest.mock("../lib/db"); // auto-mock the module

jest.mock("bcryptjs");

describe("userService", () => {
	// now typed as a Jest‐mocked sqlite Database
	let mockDb: jest.Mocked<Database>;

	beforeEach(() => {
		// build a minimal mockDb object
		mockDb = {
			get: jest.fn(),
			run: jest.fn(),
			// you can add other methods here as needed...
		} as unknown as jest.Mocked<Database>;

		// spy on and mock the real connectToDatabase
		jest.spyOn(dbModule, "connectToDatabase").mockResolvedValue(mockDb);

		(bcrypt.compare as jest.Mock).mockReset();
		(bcrypt.hash as jest.Mock).mockReset();
	});

	test("getUserByUsername calls db.get with correct query", async () => {
		const fakeUser = {
			id: 1,
			username: "u",
			password: "p",
			fullName: "n",
			role: "user",
			twoFactorEnabled: false,
			twoFactorSecret: null,
		};
		mockDb.get.mockResolvedValue(fakeUser);
		const result = await getUserByUsername("u");
		expect(mockDb.get).toHaveBeenCalledWith("SELECT * FROM users WHERE username = ?", "u");
		expect(result).toEqual(fakeUser);
	});

	test("createUser inserts and returns lastID", async () => {
		mockDb.run.mockResolvedValue({ lastID: 42 });
		const id = await createUser("u", "h", "admin", "Name");
		expect(mockDb.run).toHaveBeenCalledWith("INSERT INTO users (username, password, role, fullname) VALUES (?, ?, ?, ?)", "u", "h", "admin", "Name");
		expect(id).toBe(42);
	});

	test("countUsers returns count from db", async () => {
		mockDb.get.mockResolvedValue({ count: 7 });
		const cnt = await countUsers();
		expect(mockDb.get).toHaveBeenCalledWith("SELECT COUNT(*) AS count FROM users");
		expect(cnt).toBe(7);
	});

	test("getUserById queries correct fields", async () => {
		const fake = { id: 1 };
		mockDb.get.mockResolvedValue(fake);
		const u = await getUserById(1);
		const expectedSQL = expect.stringContaining("SELECT id, username, fullName, password, role");
		expect(mockDb.get).toHaveBeenCalledWith(expectedSQL, 1);
		expect(u).toBe(fake);
	});

	test("enableTwoFactor updates twoFactor fields", async () => {
		await enableTwoFactor(5, "secret");
		expect(mockDb.run).toHaveBeenCalledWith("UPDATE users SET twoFactorEnabled = 1, twoFactorSecret = ? WHERE id = ?", "secret", 5);
	});

	describe("updateUserPassword", () => {
		const userRec = { id: 1, password: "oldhash" } as any;

		test("throws when user not found", async () => {
			mockDb.get.mockResolvedValue(undefined);
			await expect(updateUserPassword(1, "x", "y")).rejects.toThrow("User not found");
		});

		test("throws when current password is wrong", async () => {
			mockDb.get.mockResolvedValue(userRec);
			(bcrypt.compare as jest.Mock).mockResolvedValue(false);
			await expect(updateUserPassword(1, "x", "y")).rejects.toThrow("Current password is incorrect");
		});

		test("updates password when compare passes", async () => {
			mockDb.get.mockResolvedValue(userRec);
			(bcrypt.compare as jest.Mock).mockResolvedValue(true);
			(bcrypt.hash as jest.Mock).mockResolvedValue("newhash");
			await updateUserPassword(1, "x", "y");
			expect(bcrypt.hash).toHaveBeenCalledWith("y", 10);
			expect(mockDb.run).toHaveBeenCalledWith("UPDATE users SET password = ? WHERE id = ?", "newhash", 1);
		});
	});

	test("deleteUser calls db.run with DELETE", async () => {
		await deleteUser(3);
		expect(mockDb.run).toHaveBeenCalledWith("DELETE FROM users WHERE id = ?", 3);
	});
});
