import NextAuth from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			username: string;
			role: string;
			name: string; // ← standard NextAuth name field
			twoFactorEnabled: boolean;
		};
	}
	interface User {
		id: string;
		username: string;
		role: string;
		name: string; // ← likewise
		twoFactorEnabled: boolean;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		username: string;
		role: string;
		name: string; // ← keep it here too
	}
}
