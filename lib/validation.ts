export function isValidPassword(pw: string): boolean {
	// at least 8 chars, one uppercase, one digit, one special in regex
	return /^(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/.test(pw);
}
