import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import Setup2FA from "./components/setup2FA";
import { NavigationMenu } from "./components/navigationMenu";

export const metadata = {
	title: "Manage Account",
};

export default async function Page() {
	const session = await getServerSession(authOptions);
	if (!session) {
		redirect("/login");
	}

	return (
		<div className="min-h-screen bg-base-200">
			<div className="hero py-12">
				<div className="hero-content flex-col">
					<div className="text-center  mb-8 lg:mb-0">
						<h1 className="text-4xl font-bold">Manage Your Account</h1>
						<p className="py-2 text-lg">Review and update your account settings below.</p>
					</div>

					<div className="card bg-base-100 shadow-xl w-full max-w-lg">
						<div className="card-body space-y-6">
							<h2 className="card-title">Hello, {session.user.name}</h2>

							<div className="stats stats-vertical shadow">
								<div className="stat">
									<div className="stat-title">Username</div>
									<div className="stat-value">{session.user.username}</div>
								</div>
								<div className="stat">
									<div className="stat-title">Role</div>
									<div className="stat-value capitalize">{session.user.role}</div>
								</div>
								<div className="stat">
									<div className="stat-title">2FA</div>
									<div className="stat-value">{session.user.twoFactorEnabled ? "Enabled" : "Disabled"}</div>
								</div>
							</div>

							{!session.user.twoFactorEnabled && <Setup2FA />}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
