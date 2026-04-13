import Link from "next/link";
import { Suspense } from "react";

import { AuthShell } from "@/components/auth-shell";

import { LoginForm } from "./login-form";

export default function LoginPage() {
	return (
		<AuthShell title="Sign in" description="Use the email and password you registered with.">
			<Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
				<LoginForm />
			</Suspense>
			<p className="text-center text-sm text-slate-600">
				No account yet?{" "}
				<Link href="/register" className="font-medium text-violet-700 hover:underline">
					Register
				</Link>
			</p>
		</AuthShell>
	);
}
