import { GamesPanel } from "./games-panel";
import { HealthStatus } from "./health-status";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
	return (
		<main className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:py-12">
			<div className="pointer-events-none absolute inset-0 -z-10 bg-zinc-950" aria-hidden />
			<div
				className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_90%_55%_at_50%_-15%,rgba(52,211,153,0.22),transparent_58%)]"
				aria-hidden
			/>
			<div
				className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_45%_at_0%_55%,rgba(192,132,252,0.14),transparent_50%)]"
				aria-hidden
			/>
			<div
				className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_40%_at_100%_40%,rgba(251,191,36,0.12),transparent_48%)]"
				aria-hidden
			/>
			<section className="w-full max-w-2xl space-y-4 xl:max-w-5xl">
				<Badge
					variant="secondary"
					className="rounded-full border border-white/15 bg-white/10 text-foreground/90 backdrop-blur-sm"
				>
					Platform preview
				</Badge>
				<Card className="border-white/12 bg-gradient-to-b from-zinc-800/85 to-zinc-900/90 shadow-xl shadow-black/25 backdrop-blur-md">
					<CardHeader className="space-y-2">
						<CardTitle className="text-2xl sm:text-3xl">Game Platform</CardTitle>
						<CardDescription>
							Minimal shell for simple 2D browser games with a connected health
							endpoint.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<GamesPanel />
						<Separator className="bg-gradient-to-r from-transparent via-white/20 to-transparent" />
						<HealthStatus />
					</CardContent>
				</Card>
			</section>
		</main>
	);
}
