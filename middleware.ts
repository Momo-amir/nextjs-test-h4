import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserRoleFromToken } from "./lib/auth";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// 1) Skip auth checks on public routes:
	const publicPaths = ["/login", "/register", "/api/auth/login", "/api/auth/register", "/favicon.ico"];
	if (publicPaths.some((path) => pathname.startsWith(path))) {
		return NextResponse.next();
	}

	// 2) Check for token cookie:
	const token = request.cookies.get("auth_token")?.value;
	if (!token) {
		console.warn("No auth token found, redirecting to login");
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// // 3) Validate & extract role:
	// const role = getUserRoleFromToken(token);
	// if (!role) {
	// 	console.log("Invalid auth role, redirecting to login");
	// 	return NextResponse.redirect(new URL("/login", request.url));
	// }

	// // 4) Protect admin area:
	// if (pathname.startsWith("/admin") && role !== "admin") {
	// 	return NextResponse.redirect(new URL("/unauthorized", request.url));
	// }

	// 5) Allow through
	return NextResponse.next();
}

// Optionally only run this middleware on non-static routes:
export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
