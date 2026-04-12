import { HealthStatus } from "./health-status";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
	return (
		<main className="relative flex min-h-screen items-center justify-center px-4 py-12">
			<div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(34,197,94,0.16),transparent_55%)]" />
			<section className="w-full max-w-2xl space-y-4">
				<Badge variant="secondary" className="rounded-full">
					Platform preview
				</Badge>
				<Card className="border-border/60 bg-card/80 backdrop-blur">
					<CardHeader className="space-y-2">
						<CardTitle className="text-2xl sm:text-3xl">Game Platform</CardTitle>
						<CardDescription>
							Minimal shell for simple 2D browser games with a connected health
							endpoint.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<HealthStatus />
					</CardContent>
				</Card>
			</section>
		</main>
	);
}
