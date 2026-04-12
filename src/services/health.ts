import { httpClient } from "@/lib/axios";
import type { HealthResponse } from "@/types/health";

/** Fetches the app health payload from `GET /api/health`. */
export async function fetchHealth(): Promise<HealthResponse> {
	const res = await httpClient.get<HealthResponse>("/api/health");
	return res.data;
}
