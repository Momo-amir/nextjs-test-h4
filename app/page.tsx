import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import Setup2FA from "./components/setup2FA";

export const metadata = {
	title: "Manage Account",
};

export default async function Page() {
	const session = await getServerSession(authOptions);
	if (!session) {
		redirect("/login");
	}

	return (
		<div style={{ maxWidth: 600, margin: "2rem auto" }}>
			<h1>Hello {session.user.name}</h1>
			<p>
				<strong>Username:</strong> {session.user.username}
			</p>
			<p>
				<strong>Role:</strong> {session.user.role}
			</p>
			<div>
				<Setup2FA />
			</div>
		</div>
	);
}
