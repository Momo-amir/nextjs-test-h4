import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { NavigationMenu } from "./components/navigationMenu";
import "../styles/global.css";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const session = await getServerSession(authOptions);

	return (
		<html lang="en">
			<body>
				{
					<header style={{ position: "sticky", top: 0, zIndex: 100 }}>
						<NavigationMenu showSignOut={!!session} />
					</header>
				}
				<main>{children}</main>
			</body>
		</html>
	);
}
