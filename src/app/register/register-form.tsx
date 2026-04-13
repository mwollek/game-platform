"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";

import { registerUser, type RegisterState } from "./actions";

const inputClass =
	"w-full rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-violet-200 placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-200";

export function RegisterForm() {
	const [state, formAction, pending] = useActionState<RegisterState, FormData>(
		registerUser,
		undefined
	);

	return (
		<form action={formAction} className="space-y-4">
			{state?.error ? (
				<p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900">
					{state.error}
				</p>
			) : null}
			<div className="space-y-1.5">
				<label htmlFor="register-email" className="text-sm font-medium text-slate-700">
					Email
				</label>
				<input
					id="register-email"
					name="email"
					type="email"
					autoComplete="email"
					required
					className={inputClass}
				/>
			</div>
			<div className="space-y-1.5">
				<label htmlFor="register-password" className="text-sm font-medium text-slate-700">
					Password
				</label>
				<input
					id="register-password"
					name="password"
					type="password"
					autoComplete="new-password"
					required
					minLength={8}
					className={inputClass}
				/>
				<p className="text-xs text-slate-500">At least 8 characters.</p>
			</div>
			<div className="space-y-1.5">
				<label htmlFor="register-name" className="text-sm font-medium text-slate-700">
					Display name <span className="font-normal text-slate-500">(optional)</span>
				</label>
				<input
					id="register-name"
					name="displayName"
					type="text"
					autoComplete="nickname"
					maxLength={64}
					className={inputClass}
				/>
			</div>
			<Button type="submit" className="w-full" disabled={pending}>
				{pending ? "Creating account…" : "Create account"}
			</Button>
			<p className="text-center text-sm text-slate-600">
				Already have an account?{" "}
				<Link href="/login" className="font-medium text-violet-700 hover:underline">
					Sign in
				</Link>
			</p>
		</form>
	);
}
