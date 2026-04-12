"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useHealth } from "@/hooks/use-health";
import { getHealthPanelViewModel } from "@/lib/health-display";
import { cn } from "@/lib/utils";

export function HealthStatus() {
	const { payload, error, isLoading, refresh } = useHealth();
	const { line, isHealthy, isUnhealthy, badgeLabel } = getHealthPanelViewModel(
		payload,
		error,
		isLoading
	);

	return (
		<div
			data-testid="health-panel"
			className={cn(
				"space-y-3 rounded-lg border bg-background/50 p-4 transition-colors",
				isHealthy &&
					"border-emerald-500/45 bg-emerald-500/[0.07] shadow-[0_0_0_1px_rgba(16,185,129,0.12)]",
				isUnhealthy &&
					"border-red-500/45 bg-red-500/[0.07] shadow-[0_0_0_1px_rgba(239,68,68,0.12)]",
				!isHealthy && !isUnhealthy && "border-border/70"
			)}
		>
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center gap-2">
					<Badge
						variant="outline"
						className={cn(
							isHealthy &&
								"border-emerald-500/40 bg-emerald-500/15 text-emerald-300 [a]:hover:bg-emerald-500/25",
							isUnhealthy &&
								"border-red-500/40 bg-red-500/15 text-red-300 [a]:hover:bg-red-500/25",
							!isHealthy &&
								!isUnhealthy &&
								"border-border/60 bg-muted/30 text-muted-foreground"
						)}
					>
						{badgeLabel}
					</Badge>
					<span
						className={cn(
							"text-xs",
							isHealthy && "text-emerald-400/90",
							isUnhealthy && "text-red-400/90",
							!isHealthy && !isUnhealthy && "text-muted-foreground"
						)}
					>
						GET /api/health
					</span>
				</div>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => void refresh()}
					disabled={isLoading}
				>
					{isLoading ? "Refreshing..." : "Refresh"}
				</Button>
			</div>
			<Separator
				className={cn(isHealthy && "bg-emerald-500/25", isUnhealthy && "bg-red-500/25")}
			/>
			<pre
				data-testid="health-panel-response"
				className={cn(
					"max-h-48 overflow-auto rounded-md p-3 font-mono text-xs",
					isHealthy && "bg-emerald-950/35 text-emerald-100/90",
					isUnhealthy && "bg-red-950/35 text-red-100/90",
					!isHealthy && !isUnhealthy && "bg-muted/40 text-muted-foreground"
				)}
			>
				{line}
			</pre>
		</div>
	);
}
