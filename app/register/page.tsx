"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { isValidPassword } from "lib/validation";
import Link from "next/link";

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
		<div className="hero bg-base-200 min-h-screen">
			<div className="hero-content flex-col ">
				<div className="text-center ">
					<h1 className="text-5xl font-bold">Register now!</h1>
					<p className="py-6">Create your account to get started.</p>
				</div>
				<div className="card bg-base-100 w-full max-w-sm shadow-2xl">
					<div className="card-body">
						<form onSubmit={handleSubmit}>
							<fieldset className="space-y-4">
								<label htmlFor="fullName" className="label">
									<span className="label-text">Full Name</span>
								</label>
								<input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="input input-bordered w-full" />

								<label htmlFor="username" className="label">
									<span className="label-text">Email</span>
								</label>
								<input id="username" type="email" value={username} onChange={(e) => setUsername(e.target.value)} required className="input input-bordered w-full" />

								<label htmlFor="password" className="label">
									<span className="label-text">Password</span>
								</label>
								<input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input input-bordered w-full" />

								<label htmlFor="confirmPassword" className="label">
									<span className="label-text">Confirm Password</span>
								</label>
								<input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="input input-bordered w-full" />

								{error && <p className="text-red-500">{error}</p>}
								{message && <p className="text-green-500">{message}</p>}

								<button type="submit" className="btn btn-neutral w-full mt-4">
									Register
								</button>
							</fieldset>
						</form>

						<p className="text-center mt-4">
							Already have an account?{" "}
							<Link href="/login" className="link link-primary">
								Login
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
