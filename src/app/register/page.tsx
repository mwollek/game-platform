import { AuthShell } from "@/components/auth-shell";

import { RegisterForm } from "./register-form";

export default function RegisterPage() {
	return (
		<AuthShell
			title="Create an account"
			description="Pick an email and password. You can add a display name for leaderboards later."
		>
			<RegisterForm />
		</AuthShell>
	);
}
