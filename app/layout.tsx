import { NavigationMenu } from "./components/navigationMenu";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<header style={{ position: "sticky", top: 0, zIndex: 100, background: "#fff" }}>
					<NavigationMenu />
				</header>
				<main>{children}</main>
			</body>
		</html>
	);
}
