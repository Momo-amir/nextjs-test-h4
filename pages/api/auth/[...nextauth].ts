import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
		} & DefaultSession["user"];
	}
}

export default NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.CLIENT_ID!,
			clientSecret: process.env.CLIENT_SECRET!,
		}),
	],
	session: { strategy: "jwt" },
	pages: {
		signIn: "/login",
		error: "/login", // redirect here on error
	},
	callbacks: {
		async jwt({ token, account, profile }) {
			if (account && profile) {
				token.id = profile.sub;
				token.accessToken = account.access_token;
			}
			return token;
		},
		async session({ session, token }) {
			session.user = {
				...session.user,
				id: token.id as string,
			};
			return session;
		},
	},
});
