import type { HealthResponse } from "@/types/health";

export type HealthPanelViewModel = {
	line: string;
	isHealthy: boolean;
	isUnhealthy: boolean;
	badgeLabel: string;
};

/** Maps fetch state to labels and status flags for the health panel UI (pure, easy to unit test). */
export function getHealthPanelViewModel(
	payload: HealthResponse | null,
	error: string | null,
	isLoading: boolean
): HealthPanelViewModel {
	const line =
		error ?? (payload ? JSON.stringify(payload, null, 2) : "GET /api/health - loading...");

	const resolved = !isLoading;
	const statusNorm = payload?.status?.toLowerCase() ?? "";
	const isHealthy = resolved && !error && statusNorm === "ok";
	const isUnhealthy = resolved && (error !== null || (payload != null && statusNorm !== "ok"));

	const badgeLabel = error ? "unhealthy" : payload ? payload.status : "checking";

	return { line, isHealthy, isUnhealthy, badgeLabel };
}
