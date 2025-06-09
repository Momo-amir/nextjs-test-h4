import type { NextApiRequest, NextApiResponse } from "next";
import { compare } from "bcryptjs";
import { getUserByUsername } from "./userService";
import { signJwt } from "../lib/auth";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	const { username, password } = req.body;
	if (!username || !password) {
		return res.status(400).json({ message: "Username and password are required" });
	}

	const user = await getUserByUsername(username);
	if (!user) {
		return res.status(401).json({ message: "Invalid credentials" });
	}

	const isValid = await compare(password, user.password);
	if (!isValid) {
		return res.status(401).json({ message: "Invalid credentials" });
	}

	const token = signJwt({ userId: user.id, username: user.username, role: user.role });
	res.setHeader("Set-Cookie", `auth_token=${token}; HttpOnly; Path=/; Max-Age=3600; Secure; SameSite=Strict`);
	return res.status(200).json({ message: "Login successful" });
}
