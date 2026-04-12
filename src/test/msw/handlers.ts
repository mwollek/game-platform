import { HttpResponse, http } from "msw";

import type { HealthResponse } from "@/types/health";

export const healthyHealthResponse: HealthResponse = {
	status: "ok",
	service: "game-platform",
	timestamp: "2026-01-01T00:00:00.000Z",
};

export const handlers = [
	http.get("*/api/health", () => {
		return HttpResponse.json(healthyHealthResponse);
	}),
];
