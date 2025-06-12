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
			setError("Login failed - wrong email or password");
		}
	};

	return (
		<div className="hero bg-base-200 min-h-screen">
			<div className="hero-content flex-col ">
				<div className="text-center">
					<h1 className="text-5xl font-bold">Login now!</h1>
					<p className="py-6">Enter your credentials to access your account.</p>
				</div>
				<div className="card bg-base-100 w-full max-w-sm shadow-2xl">
					<div className="card-body">
						<form onSubmit={handleSubmit}>
							<fieldset className="space-y-4">
								<label htmlFor="username" className="label">
									<span className="label-text">Username</span>
								</label>
								<input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="input input-bordered w-full" />

								<label htmlFor="password" className="label">
									<span className="label-text">Password</span>
								</label>
								<input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input input-bordered w-full" />

								{needs2FA && (
									<>
										<label htmlFor="totp" className="label">
											<span className="label-text">2FA Code</span>
										</label>
										<input id="totp" type="text" value={totp} onChange={(e) => setTotp(e.target.value)} required className="input input-bordered w-full" />
									</>
								)}

								{error && <p className="text-red-500">{error}</p>}

								<button type="submit" className="btn btn-neutral w-full mt-4">
									Login
								</button>
							</fieldset>
						</form>

						<button type="button" onClick={() => signIn("google", { callbackUrl: "/" })} className="btn btn-outline btn-neutral w-full mt-2">
							Sign in with Google
						</button>

						<p className="text-center mt-4">
							Don’t have an account?{" "}
							<Link href="/register" className="link link-primary">
								Register
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
