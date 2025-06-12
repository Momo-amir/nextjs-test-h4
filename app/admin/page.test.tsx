import Admin, { metadata } from "./page";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

jest.mock("next-auth", () => ({
	__esModule: true,
	default: jest.fn(), // mock NextAuth() so that we have an api we can use. this took me 20 min to realize :^)
	getServerSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
	redirect: jest.fn(),
}));

describe("app/admin/page.tsx", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("calls getServerSession with authOptions", async () => {
		(getServerSession as jest.Mock).mockResolvedValue({ user: { role: "admin" } });
		await Admin();
		expect(getServerSession).toHaveBeenCalledWith(authOptions);
	});

	it("redirects to /unauthorized when signed in but not admin", async () => {
		(getServerSession as jest.Mock).mockResolvedValue({ user: { role: "user" } });
		await expect(Admin()).resolves; // we expect it to resol
		expect(redirect).toHaveBeenCalledWith("/unauthorized");
	});

	//Why don't we have a test for not logged in? well easy peasy mate,
	//all that is already directly controlled through the nextAuthJS library in the middleware.ts file,

	//The problem with the middleware withAuth from NextJS is that it does not easily
	//support different routes based on user tokens and will always redirect to login :),
	//so we instead have the logic in a SSR page component. You would prolly correct this for a real project.

	it("returns a React element when user is admin", async () => {
		(getServerSession as jest.Mock).mockResolvedValue({ user: { role: "admin" } });
		const result = await Admin();
		expect(result).toMatchObject({
			type: "div",
			props: { children: expect.anything() },
		});
		expect(result).toMatchSnapshot();
	});
});
