import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Admin() {
	const session = await getServerSession(authOptions);

	if (session != null && session.user.role !== "admin") {
		redirect("/unauthorized");
	}
	return (
		<div>
			<h1>Admin Page - here are the nuke codes! 123411</h1>
		</div>
	);
}
export const metadata = {
	title: "Admin Page",
	description: "Admin page for managing the application.",
};
