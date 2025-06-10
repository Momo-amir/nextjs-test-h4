// filepath: pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { authenticator } from "otplib";
import { getUserByUsername, createUser, countUsers } from "../../../services/userService";

export const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		CredentialsProvider({
			name: "Username / Password",
			credentials: { username: { label: "User", type: "text" }, password: { label: "Pass", type: "password" }, totp: { label: "2FA", type: "text", optional: true } },
			async authorize(creds) {
				if (!creds?.username || !creds?.password) return null;
				const user = await getUserByUsername(creds.username);
				if (!user) return null;
				const ok = await compare(creds.password, user.password);
				if (!ok) return null;

				if (user.twoFactorEnabled) {
					if (!creds.totp) throw new Error("2FA code required");
					const valid = authenticator.check(creds.totp, user.twoFactorSecret!);
					if (!valid) throw new Error("Invalid 2FA code");
				}

				// return must include { id, username, role, name }
				return {
					id: user.id.toString(),
					username: user.username,
					role: user.role,
					name: user.fullName, // maps fullName to name which NextAuth expects as a standard field
				};
			},
		}),
		GoogleProvider({
			clientId: process.env.CLIENT_ID!,
			clientSecret: process.env.CLIENT_SECRET!,
			authorization: {
				params: {
					prompt: "select_account",
					access_type: "offline", // if you also need refresh tokens
					response_type: "code",
				},
			},
		}),
	],

	session: { strategy: "jwt" },
	pages: { signIn: "/login", error: "/login" },
	useSecureCookies: true,

	callbacks: {
		async jwt({ token, user, account, profile }) {
			// first time jwt callback is run, `user` is set for credentials or google
			if (user) {
				token.id = user.id;
				token.username = user.username;
				token.role = user.role;
				token.name = (user as any).name; // Name from credentials flow
			}
			// for Google, user object comes from profile only on initial sign in - this is where we map the profile fields to the token
			if (account?.provider === "google" && profile) {
				const email = (profile as any).email as string;
				const fullName = (profile as any).name as string;

				let dbu = await getUserByUsername(email);
				if (!dbu) {
					const role = (await countUsers()) === 0 ? "admin" : "user";
					await createUser(email, "", role, fullName);
					dbu = await getUserByUsername(email);
				}
				token.id = dbu!.id.toString();
				token.username = dbu!.username;
				token.role = dbu!.role;
				token.name = dbu!.fullName;
			}

			// console.log("🔑 JWT callback, token is now:", token);
			return token;
		},

		async session({ session, token }) {
			// session.user now has id, username, role per our declaration
			session.user = {
				id: token.id as string,
				username: token.username as string,
				role: token.role as string,
				name: token.name as string,
			};
			// console.log("👤 Session callback, session.user is:", session.user);
			return session;
		},
	},
};

export default NextAuth(authOptions);
