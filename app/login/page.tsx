"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [totp, setTotp] = useState("");
	const [needs2FA, setNeeds2FA] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		const res = await signIn("credentials", {
			redirect: false,
			username,
			password,
			...(needs2FA ? { totp } : {}),
		});

		if (res?.ok) {
			router.push("/");
		} else if (res?.error === "2FA code required") {
			setNeeds2FA(true);
		} else {
			setError(res?.error || "Login failed");
		}
	};

	return (
		<div style={{ maxWidth: "400px", margin: "2rem auto", padding: "1rem" }}>
			<h1>Login</h1>
			<form onSubmit={handleSubmit}>
				<div style={{ marginBottom: "1rem" }}>
					<label htmlFor="username">Username:</label>
					<input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: "100%", padding: "0.5rem" }} />
				</div>

				<div style={{ marginBottom: "1rem" }}>
					<label htmlFor="password">Password:</label>
					<input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: "0.5rem" }} />
				</div>

				{needs2FA && (
					<div style={{ marginBottom: "1rem" }}>
						<label htmlFor="totp">2FA Code:</label>
						<input id="totp" type="text" value={totp} onChange={(e) => setTotp(e.target.value)} required style={{ width: "100%", padding: "0.5rem" }} />
					</div>
				)}

				<button type="submit">Login</button>
			</form>

			<button type="button" style={{ marginTop: "1rem" }} onClick={() => signIn("google", { callbackUrl: "/" })}>
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
