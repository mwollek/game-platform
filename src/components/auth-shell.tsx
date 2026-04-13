import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AuthShellProps = {
	title: string;
	description: string;
	children: ReactNode;
};

export function AuthShell({ title, description, children }: AuthShellProps) {
	return (
		<main className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:py-12">
			<div className="pointer-events-none absolute inset-0 -z-10 bg-[#fffdf8]" aria-hidden />
			<div
				className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_90%_65%_at_50%_-20%,rgba(184,242,230,0.45),transparent_62%)]"
				aria-hidden
			/>
			<div
				className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_0%_70%,rgba(217,194,255,0.32),transparent_55%)]"
				aria-hidden
			/>
			<section className="w-full max-w-md">
				<Card className="border-violet-100 bg-white/90 shadow-[0_20px_40px_rgba(15,23,42,0.12)] backdrop-blur-md">
					<CardHeader className="space-y-2">
						<CardTitle className="text-xl text-slate-900 sm:text-2xl">
							{title}
						</CardTitle>
						<CardDescription className="text-slate-600">{description}</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">{children}</CardContent>
				</Card>
			</section>
		</main>
	);
}
