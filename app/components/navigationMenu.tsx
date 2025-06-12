"use client";
import { signOut } from "next-auth/react";

export function NavigationMenu({ showSignOut = false }: { showSignOut?: boolean }) {
	return (
		<nav className="navbar bg-base-100 shadow-sm px-4">
			<div className="flex-1">
				<a href="/" className="btn btn-ghost text-xl">
					APP LOGO
				</a>
			</div>
			{showSignOut && (
				<div className="flex-none">
					<button onClick={() => signOut({ callbackUrl: "/login" })} className="btn btn-ghost">
						Logout
					</button>
				</div>
			)}
		</nav>
	);
}
