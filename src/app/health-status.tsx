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
				"space-y-3 rounded-2xl border bg-white/80 p-4 transition-colors shadow-sm",
				isHealthy &&
					"border-emerald-200 bg-gradient-to-b from-emerald-50 to-teal-50 shadow-[0_10px_24px_rgba(16,185,129,0.12)]",
				isUnhealthy &&
					"border-red-200 bg-gradient-to-b from-red-50 to-orange-50 shadow-[0_10px_24px_rgba(239,68,68,0.1)]",
				!isHealthy &&
					!isUnhealthy &&
					"border-violet-100 bg-gradient-to-b from-violet-50/80 to-white"
			)}
		>
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center gap-2">
					<Badge
						variant="outline"
						className={cn(
							isHealthy &&
								"border-emerald-300 bg-emerald-100 text-emerald-700 [a]:hover:bg-emerald-200",
							isUnhealthy &&
								"border-red-300 bg-red-100 text-red-700 [a]:hover:bg-red-200",
							!isHealthy &&
								!isUnhealthy &&
								"border-violet-200 bg-violet-100 text-violet-700"
						)}
					>
						{isHealthy ? "🟢 API online" : badgeLabel}
					</Badge>
					<span
						className={cn(
							"text-xs",
							isHealthy && "text-emerald-700",
							isUnhealthy && "text-red-700",
							!isHealthy && !isUnhealthy && "text-violet-700"
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
					className="text-slate-700 hover:bg-slate-100"
				>
					{isLoading ? "Refreshing..." : "Refresh"}
				</Button>
			</div>
			<Separator
				className={cn(
					isHealthy && "bg-emerald-200",
					isUnhealthy && "bg-red-200",
					!isHealthy && !isUnhealthy && "bg-violet-200"
				)}
			/>
			<pre
				data-testid="health-panel-response"
				className={cn(
					"max-h-48 overflow-auto rounded-xl border p-3 font-mono text-xs",
					isHealthy && "border-emerald-200 bg-emerald-100/60 text-emerald-900",
					isUnhealthy && "border-red-200 bg-red-100/60 text-red-900",
					!isHealthy &&
						!isUnhealthy &&
						"border-violet-200 bg-violet-100/60 text-violet-900"
				)}
			>
				{line}
			</pre>
		</div>
	);
}
