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
		<div style={{ maxWidth: 400, margin: "2rem auto" }}>
			<h1>Enable Two‐Factor Authentication</h1>
			{!qr ? (
				<button onClick={handleSetup}>Generate QR Code</button>
			) : (
				<>
					<p>Scan this with your authenticator app:</p>
					<img src={qr} alt="2FA QR Code" />
					<p>Then enter one code on your login form to verify.</p>
				</>
			)}
			{err && <p style={{ color: "red" }}>{err}</p>}
		</div>
	);
}
