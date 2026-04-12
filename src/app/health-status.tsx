"use client";

import { useEffect, useId, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useHealth } from "@/hooks/use-health";
import { getHealthPanelViewModel } from "@/lib/health-display";
import { cn } from "@/lib/utils";

export function HealthStatus() {
	const panelDomId = useId();
	const panelRef = useRef<HTMLDivElement>(null);
	const indicatorRef = useRef<HTMLButtonElement>(null);
	const [open, setOpen] = useState(false);

	const { payload, error, isLoading, refresh } = useHealth();
	const { line, isHealthy, isUnhealthy, badgeLabel } = getHealthPanelViewModel(
		payload,
		error,
		isLoading
	);

	const statusLabel = isLoading
		? "Checking API health"
		: isHealthy
			? "API online"
			: error
				? `API error: ${error}`
				: `API status: ${badgeLabel}`;

	useEffect(() => {
		if (!open) return;

		const onPointerDown = (e: PointerEvent) => {
			const target = e.target as Node;
			const onPanel = panelRef.current?.contains(target) ?? false;
			const onIndicator = indicatorRef.current?.contains(target) ?? false;
			if (onPanel || onIndicator) return;
			setOpen(false);
		};

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};

		document.addEventListener("pointerdown", onPointerDown);
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("pointerdown", onPointerDown);
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [open]);

	return (
		<div data-testid="health-widget" className="fixed bottom-5 right-5 z-50">
			<div className="relative flex flex-col items-end gap-2">
				<div
					ref={panelRef}
					id={panelDomId}
					data-testid="health-panel"
					role="region"
					aria-label="API health details"
					hidden={!open}
					className={cn(
						"w-[min(calc(100vw-2rem),22rem)] rounded-2xl border bg-white/95 p-4 shadow-lg backdrop-blur-md",
						isHealthy &&
							"border-emerald-200 bg-gradient-to-b from-emerald-50 to-teal-50 shadow-[0_12px_28px_rgba(16,185,129,0.14)]",
						isUnhealthy &&
							"border-red-200 bg-gradient-to-b from-red-50 to-orange-50 shadow-[0_12px_28px_rgba(239,68,68,0.12)]",
						!isHealthy &&
							!isUnhealthy &&
							"border-violet-100 bg-gradient-to-b from-violet-50/90 to-white shadow-[0_12px_28px_rgba(139,92,246,0.1)]"
					)}
				>
					<div className="space-y-3">
						<div className="flex items-center justify-between gap-3">
							<div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
								<Badge
									variant="outline"
									className={cn(
										"w-fit shrink-0",
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
										"truncate text-xs",
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
								className="shrink-0 text-slate-700 hover:bg-slate-100"
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
								isHealthy &&
									"border-emerald-200 bg-emerald-100/60 text-emerald-900",
								isUnhealthy && "border-red-200 bg-red-100/60 text-red-900",
								!isHealthy &&
									!isUnhealthy &&
									"border-violet-200 bg-violet-100/60 text-violet-900"
							)}
						>
							{line}
						</pre>
					</div>
				</div>

				<button
					ref={indicatorRef}
					type="button"
					data-testid="health-indicator"
					aria-label={statusLabel}
					aria-expanded={open}
					aria-controls={panelDomId}
					onClick={() => setOpen((v) => !v)}
					className={cn(
						"relative flex size-10 shrink-0 items-center justify-center rounded-full border-2 bg-white/90 shadow-md backdrop-blur-sm transition-[transform,box-shadow] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2",
						open && "ring-2 ring-violet-300 ring-offset-2",
						isHealthy && "border-emerald-400 shadow-[0_0_0_1px_rgba(16,185,129,0.15)]",
						isUnhealthy && "border-red-400 shadow-[0_0_0_1px_rgba(239,68,68,0.12)]",
						!isHealthy && !isUnhealthy && "border-violet-300"
					)}
				>
					<span
						className={cn(
							"size-2.5 rounded-full",
							isHealthy && "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.65)]",
							isUnhealthy && "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.55)]",
							!isHealthy && !isUnhealthy && "animate-pulse bg-violet-400"
						)}
						aria-hidden
					/>
				</button>
			</div>
		</div>
	);
}
