const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ParsedRegister =
	| { email: string; password: string; displayName: string | null }
	| { error: string };

export function parseRegister(formData: FormData): ParsedRegister {
	const emailRaw = String(formData.get("email") ?? "")
		.trim()
		.toLowerCase();
	const password = String(formData.get("password") ?? "");
	const displayNameRaw = String(formData.get("displayName") ?? "").trim();

	if (!emailRaw || !EMAIL_RE.test(emailRaw)) {
		return { error: "Enter a valid email address." };
	}
	if (password.length < 8) {
		return { error: "Password must be at least 8 characters." };
	}
	if (password.length > 128) {
		return { error: "Password is too long." };
	}
	if (displayNameRaw.length > 64) {
		return { error: "Display name must be at most 64 characters." };
	}

	const displayName = displayNameRaw.length > 0 ? displayNameRaw : null;

	return { email: emailRaw, password, displayName };
}
