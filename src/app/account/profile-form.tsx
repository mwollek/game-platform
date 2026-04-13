"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";

import { updateDisplayName, type UpdateProfileState } from "./actions";

const inputClass =
	"w-full rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-violet-200 placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-200";

type ProfileFormProps = {
	initialName: string;
};

export function ProfileForm({ initialName }: ProfileFormProps) {
	const [state, formAction, pending] = useActionState<UpdateProfileState, FormData>(
		updateDisplayName,
		undefined
	);

	return (
		<form action={formAction} className="space-y-4">
			{state?.error ? (
				<p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900">
					{state.error}
				</p>
			) : null}
			{state?.ok ? (
				<p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
					Display name saved.
				</p>
			) : null}
			<div className="space-y-1.5">
				<label htmlFor="profile-name" className="text-sm font-medium text-slate-700">
					Display name
				</label>
				<input
					id="profile-name"
					name="name"
					type="text"
					autoComplete="nickname"
					maxLength={64}
					defaultValue={initialName}
					className={inputClass}
				/>
				<p className="text-xs text-slate-500">
					Shown on your profile; you can leave this blank.
				</p>
			</div>
			<Button type="submit" disabled={pending}>
				{pending ? "Saving…" : "Save display name"}
			</Button>
		</form>
	);
}
