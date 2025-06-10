"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { isValidPassword } from "lib/validation";

export default function Register() {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");
	const [fullName, setFullName] = useState("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		setMessage("");

		// Validate inputs
		if (!username || !password || !confirmPassword || !fullName) {
			setError("All fields are required.");
			return;
		}
		if (!isValidPassword(password)) {
			setError("Password must be 8+ chars, include an uppercase letter, a number & a special character.");
			return;
		}
		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password, fullName }),
			});

			const data = await res.json();
			if (!res.ok) {
				setError(data.message || "Something went wrong.");
			} else {
				setMessage("Registration successful! Redirecting...");
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
					<label htmlFor="fullName">Full Name</label>
					<br />
					<input type="text" id="fullName" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={{ width: "100%", padding: "0.5rem" }} />
				</div>
				<div style={{ marginBottom: "1rem" }}>
					<label htmlFor="username">Email</label>
					<br />
					<input type="email" id="username" placeholder="example@example.com" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: "100%", padding: "0.5rem" }} />
				</div>

				<div style={{ marginBottom: "1rem" }}>
					<label htmlFor="password">Password</label>
					<br />
					<input type="password" placeholder="Enter your password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: "0.5rem" }} />
				</div>

				<div style={{ marginBottom: "1rem" }}>
					<label htmlFor="confirmPassword">Confirm Password</label>
					<br />
					<input type="password" placeholder="Confirm your password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={{ width: "100%", padding: "0.5rem" }} />
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
