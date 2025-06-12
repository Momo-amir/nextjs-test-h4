import { withAuth } from "next-auth/middleware";
import { redirect } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
	"/login",
	"/register",
	"/unauthorized",
	"/api/auth", // allow all NextAuth endpoints
];

export default withAuth({
	callbacks: {
		authorized({ token, req }) {
			const { pathname } = req.nextUrl;

			// 1) let public pages and NextAuth API routes through
			if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
				return true;
			}

			// 2) require a token for everything else
			if (!token) {
				return false;
			}

			return true;
		},
	},
});

// only run this middleware on all non-API, non-_next, non-image routes:
export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
