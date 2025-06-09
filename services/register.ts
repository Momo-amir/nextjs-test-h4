import type { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcryptjs";
import { getUserByUsername, createUser, countUsers } from "./userService";

export default async function register(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") return res.status(405).json({ message: "Only POST" });

	const { username, password } = req.body;
	if (!username || !password) return res.status(400).json({ message: "Username & password required" });

	if (await getUserByUsername(username)) return res.status(409).json({ message: "Username taken" });

	const pwdHash = await hash(password, 10);
	const isFirst = (await countUsers()) === 0;
	const role = isFirst ? "admin" : "user";

	await createUser(username, pwdHash, role);
	return res.status(201).json({
		message: `Registered as ${role}`,
	});
}
