import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { enableTwoFactor } from "../../../services/userService";
import { authenticator } from "otplib";
import QRCode from "qrcode";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") return res.status(405).end();
	const session = await getServerSession(req, res, authOptions);
	if (!session) return res.status(401).end();

	// 1) Generate a new secret
	const secret = authenticator.generateSecret();
	// 2) Persist it
	await enableTwoFactor(Number(session.user.id), secret);

	// 3) Build an otpauth URL and convert to QR code data URI
	const otpauth = authenticator.keyuri(session.user.username, "Test-h4", secret);
	const qrCodeDataURL = await QRCode.toDataURL(otpauth);

	res.status(200).json({ qrCodeDataURL, secret });
}
