import Link from "next/link";

import { SnakeGame } from "./snake-game";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SnakePage() {
	return (
		<main className="relative min-h-screen overflow-hidden bg-[#fffdf8] px-4 py-8 sm:px-6 sm:py-10">
			<div
				className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_65%_45%_at_10%_0%,rgba(167,243,208,0.35),transparent_65%)]"
				aria-hidden
			/>
			<div
				className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_38%_at_100%_15%,rgba(196,181,253,0.24),transparent_58%)]"
				aria-hidden
			/>
			<section className="mx-auto flex w-full max-w-6xl flex-col gap-4">
				<Link
					href="/"
					className="w-fit rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:bg-white"
				>
					← Back to games
				</Link>
				<Card className="border-cyan-100 bg-white/85 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-sm">
					<CardHeader className="space-y-2">
						<CardTitle className="text-2xl text-slate-900">Snake</CardTitle>
						<CardDescription className="text-slate-600">
							Neon board, smoother pacing, and a celebration sequence on win.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<SnakeGame />
					</CardContent>
				</Card>
			</section>
		</main>
	);
}
