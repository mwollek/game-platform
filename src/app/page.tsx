import { GamesPanel } from "./games-panel";
import { HealthStatus } from "./health-status";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
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
			<div
				className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_45%_40%_at_100%_35%,rgba(255,214,179,0.35),transparent_52%)]"
				aria-hidden
			/>
			<div
				className="pointer-events-none absolute left-6 top-10 -z-10 h-24 w-24 rounded-full bg-violet-200/45 blur-2xl sm:h-32 sm:w-32"
				aria-hidden
			/>
			<div
				className="pointer-events-none absolute bottom-12 right-8 -z-10 h-24 w-24 rounded-full bg-cyan-200/45 blur-2xl sm:h-28 sm:w-28"
				aria-hidden
			/>
			<section className="w-full max-w-2xl space-y-4 xl:max-w-5xl">
				<Badge
					variant="secondary"
					className="rounded-full border border-violet-200 bg-white/80 text-slate-700 shadow-sm backdrop-blur-sm"
				>
					Platform Preview
				</Badge>
				<Card className="border-violet-100 bg-white/85 shadow-[0_20px_40px_rgba(15,23,42,0.12)] backdrop-blur-md">
					<CardHeader className="space-y-2">
						<CardTitle className="text-2xl text-slate-900 sm:text-3xl">
							Game Zone
						</CardTitle>
						<CardDescription className="text-slate-600">
							Pick a game and jump straight into the fun.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<GamesPanel />
					</CardContent>
				</Card>
			</section>
			<HealthStatus />
		</main>
	);
}
