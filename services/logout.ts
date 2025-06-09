import type { NextApiRequest, NextApiResponse } from "next";

export default function logout(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") return res.status(405).json({ message: "Only POST" });

	res.setHeader(
		"Set-Cookie",
		// clear cookie immediately
		`auth_token=; HttpOnly; Path=/; Max-Age=0; Secure; SameSite=Strict`
	);
	return res.status(200).json({ message: "Logged out" });
}
