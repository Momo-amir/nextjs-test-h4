export type User = {
	id: number;
	username: string;
	fullName: string;
	password: string;
	role: "user" | "admin";
	twoFactorEnabled: boolean; // true once 2FA is turned on
	twoFactorSecret: string | null;
};
