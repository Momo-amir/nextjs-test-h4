"use client";
import { useState } from "react";

export default function Setup2FA() {
	const [qr, setQr] = useState<string | null>(null);
	const [err, setErr] = useState("");

	async function handleSetup() {
		setErr("");
		const res = await fetch("/api/2fa/setup", { method: "POST" });
		if (!res.ok) {
			setErr("Could not generate 2FA");
			return;
		}
		const { qrCodeDataURL } = await res.json();
		setQr(qrCodeDataURL);
	}

	return (
		<div className="card bg-base-100 shadow-lg mx-auto my-8 p-6 max-w-sm">
			<h1 className="text-xl font-bold mb-4">Enable Two‐Factor Authentication</h1>

			{!qr ? (
				<button onClick={handleSetup} className="btn btn-neutral w-full">
					Generate QR Code
				</button>
			) : (
				<>
					<p className="mb-4">Scan this with your authenticator app:</p>
					<img src={qr} alt="2FA QR Code" className="mx-auto mb-4 w-48 h-48" />
					<p className="mb-2">Then enter one code on your login form to verify.</p>
				</>
			)}

			{err && <p className="text-red-500 mt-2">{err}</p>}
		</div>
	);
}
