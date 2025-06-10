"use client";
import { signOut } from "next-auth/react";

export function NavigationMenu() {
	return (
		<nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem", borderBottom: "1px solid #ccc" }}>
			<a href="/">Home</a>
			{<button onClick={() => signOut({ callbackUrl: "/login" })}>Logout</button>}
		</nav>
	);
}
