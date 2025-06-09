"use client";
import { useRouter } from "next/navigation";

export function NavigationMenu() {
	const router = useRouter();

	const handleLogout = async () => {
		await fetch("/api/auth/logout", { method: "POST" });
		router.push("/login");
	};

	return (
		<nav>
			<a href="/">Home</a>
			{/* only show for authenticated users: */}
			<button onClick={handleLogout}>Logout</button>
		</nav>
	);
}
