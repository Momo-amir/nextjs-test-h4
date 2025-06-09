"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		const res = await fetch("/api/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username, password }),
		});

		if (res.ok) {
			router.push("/"); // Redirect to home on successful login
		} else {
			const data = await res.json();
			setError(data.message || "Login failed");
		}
	};

	return (
		<div style={{ maxWidth: "400px", margin: "0 auto", padding: "2rem" }}>
			<h1>Login</h1>
			<form onSubmit={handleSubmit}>
				<div style={{ marginBottom: "1rem" }}>
					<label htmlFor="username">Username:</label>
					<input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: "100%", padding: "0.5rem" }} />
				</div>
				<div style={{ marginBottom: "1rem" }}>
					<label htmlFor="password">Password:</label>
					<input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: "0.5rem" }} />{" "}
				</div>
				<button type="submit">Login</button>
			</form>

			<button type="button" style={{ marginTop: "1rem" }} onClick={() => signIn("google")}>
				Sign in with Google
			</button>

			<p style={{ marginTop: "1rem" }}>
				Don’t have an account?{" "}
				<Link href="/register" style={{ color: "blue" }}>
					Register
				</Link>
			</p>
			{error && <p style={{ color: "red" }}>{error}</p>}
		</div>
	);
};

export default Login;
