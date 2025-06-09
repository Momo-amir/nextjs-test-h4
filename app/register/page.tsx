"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		setMessage("");

		// Validate inputs
		if (!username || !password || !confirmPassword) {
			setError("All fields are required.");
			return;
		}
		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}
		// Optional: enforce stronger password requirements here

		try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
			});

			const data = await res.json();
			if (!res.ok) {
				setError(data.message || "Something went wrong.");
			} else {
				setMessage("Registration successful! Redirecting...");
				// Redirect to login or home page after a short delay
				setTimeout(() => {
					router.push("/login");
				}, 1500);
			}
		} catch (err: any) {
			setError("An error occurred. Please try again.");
		}
	};

	return (
		<div style={{ maxWidth: "400px", margin: "0 auto", padding: "2rem" }}>
			<h1>Register</h1>
			<form onSubmit={handleSubmit}>
				<div style={{ marginBottom: "1rem" }}>
					<label htmlFor="username">Username</label>
					<br />
					<input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: "100%", padding: "0.5rem" }} />
				</div>

				<div style={{ marginBottom: "1rem" }}>
					<label htmlFor="password">Password</label>
					<br />
					<input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: "0.5rem" }} />
				</div>

				<div style={{ marginBottom: "1rem" }}>
					<label htmlFor="confirmPassword">Confirm Password</label>
					<br />
					<input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={{ width: "100%", padding: "0.5rem" }} />
				</div>

				{error && <p style={{ color: "red" }}>{error}</p>}
				{message && <p style={{ color: "green" }}>{message}</p>}

				<button type="submit" style={{ padding: "0.5rem 1rem" }}>
					Register
				</button>
			</form>
		</div>
	);
}
