import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./page";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

jest.mock("next-auth/react", () => ({
	__esModule: true,
	signIn: jest.fn(),
}));

jest.mock("next/navigation", () => ({
	__esModule: true,
	useRouter: jest.fn(),
}));

describe("<Login />", () => {
	const push = jest.fn();

	beforeEach(() => {
		(useRouter as jest.Mock).mockReturnValue({ push });
		(signIn as jest.Mock).mockReset();
		push.mockReset();
	});

	//
	it("navigates to / on successful login", async () => {
		(signIn as jest.Mock).mockResolvedValue({ ok: true });
		render(<Login />);

		fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "bob" } });
		fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "pass" } });
		fireEvent.click(screen.getByRole("button", { name: /login/i }));

		await waitFor(() => {
			expect(signIn).toHaveBeenCalledWith("credentials", {
				redirect: false,
				username: "bob",
				password: "pass",
			});
			expect(push).toHaveBeenCalledWith("/");
		});
	});

	it("shows 2FA field when server asks for it", async () => {
		(signIn as jest.Mock).mockResolvedValue({ ok: false, error: "2FA code required" });
		render(<Login />);

		fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "alice" } });
		fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "pw" } });
		fireEvent.click(screen.getByRole("button", { name: /login/i }));

		// waits for the component to re-render with 2FA :)
		await waitFor(() => {
			expect(signIn).toHaveBeenCalledWith("credentials", {
				redirect: false,
				username: "alice",
				password: "pw",
			});
			expect(screen.getByLabelText(/2FA Code/i)).toBeInTheDocument();
		});
	});

	it("displays error message on bad credentials", async () => {
		(signIn as jest.Mock).mockResolvedValue({ ok: false, error: "whatever" });
		render(<Login />);

		fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "joe" } });
		fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "wrong" } });
		fireEvent.click(screen.getByRole("button", { name: /login/i }));

		await waitFor(() => {
			expect(signIn).toHaveBeenCalled();
			expect(screen.getByText(/Login failed - wrong email or password/i)).toBeInTheDocument();
		});
	});
});
