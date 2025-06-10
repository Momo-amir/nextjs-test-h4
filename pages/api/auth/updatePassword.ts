import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";
import { updateUserPassword } from "../../../services/userService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") return res.status(405).end();
	const session = await getServerSession(req, res, authOptions);
	if (!session) return res.status(401).end();

	const { currentPassword, newPassword } = req.body;
	if (!currentPassword || !newPassword) {
		return res.status(400).json({ message: "Both fields are required" });
	}

	try {
		await updateUserPassword(Number(session.user.id), currentPassword, newPassword);
		return res.status(200).json({ message: "Password updated" });
	} catch (err: any) {
		return res.status(400).json({ message: err.message });
	}
}
