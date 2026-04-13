"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const inputClass =
	"w-full rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-violet-200 placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-200";

export function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") ?? "/";
	const registered = searchParams.get("registered") === "1";
	const authError = searchParams.get("error");

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [formError, setFormError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setFormError(null);
		setPending(true);
		const result = await signIn("credentials", {
			email: email.trim().toLowerCase(),
			password,
			redirect: false,
		});
		setPending(false);

		if (result?.error) {
			setFormError("Invalid email or password.");
			return;
		}
		if (result?.ok) {
			router.push(callbackUrl.startsWith("/") ? callbackUrl : "/");
			router.refresh();
		}
	}

	return (
		<form onSubmit={onSubmit} className="space-y-4">
			{registered ? (
				<p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
					Account created. You can sign in now.
				</p>
			) : null}
			{authError === "CredentialsSignin" && !formError ? (
				<p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900">
					Invalid email or password.
				</p>
			) : null}
			{formError ? (
				<p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900">
					{formError}
				</p>
			) : null}
			<div className="space-y-1.5">
				<label htmlFor="login-email" className="text-sm font-medium text-slate-700">
					Email
				</label>
				<input
					id="login-email"
					name="email"
					type="email"
					autoComplete="email"
					required
					value={email}
					onChange={(ev) => setEmail(ev.target.value)}
					className={inputClass}
				/>
			</div>
			<div className="space-y-1.5">
				<label htmlFor="login-password" className="text-sm font-medium text-slate-700">
					Password
				</label>
				<input
					id="login-password"
					name="password"
					type="password"
					autoComplete="current-password"
					required
					value={password}
					onChange={(ev) => setPassword(ev.target.value)}
					className={inputClass}
				/>
			</div>
			<Button type="submit" className="w-full" disabled={pending}>
				{pending ? "Signing in…" : "Sign in"}
			</Button>
		</form>
	);
}
