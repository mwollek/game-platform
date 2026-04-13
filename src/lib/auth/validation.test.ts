import { describe, expect, it } from "vitest";

import { parseRegister } from "./validation";

function formWith(entries: Record<string, string>): FormData {
	const fd = new FormData();
	for (const [k, v] of Object.entries(entries)) {
		fd.set(k, v);
	}
	return fd;
}

describe("parseRegister", () => {
	it("accepts valid input", () => {
		const result = parseRegister(
			formWith({
				email: "User@Example.com",
				password: "password123",
				displayName: "Player One",
			})
		);
		expect(result).toEqual({
			email: "user@example.com",
			password: "password123",
			displayName: "Player One",
		});
	});

	it("rejects invalid email", () => {
		const result = parseRegister(
			formWith({ email: "not-an-email", password: "password123", displayName: "" })
		);
		expect(result).toEqual({ error: "Enter a valid email address." });
	});

	it("rejects short password", () => {
		const result = parseRegister(
			formWith({ email: "a@b.co", password: "short", displayName: "" })
		);
		expect(result).toEqual({ error: "Password must be at least 8 characters." });
	});

	it("maps empty display name to null", () => {
		const result = parseRegister(
			formWith({ email: "a@b.co", password: "longenough", displayName: "   " })
		);
		expect(result).toMatchObject({ displayName: null });
	});
});
