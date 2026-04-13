import { HttpResponse, http } from "msw";

import { GAMES } from "@/lib/games";
import type { HealthResponse } from "@/types/health";
import type { GamesListResponse } from "@/types/games";

export const healthyHealthResponse: HealthResponse = {
	status: "ok",
	service: "game-platform",
	timestamp: "2026-01-01T00:00:00.000Z",
	database: "ok",
};

export const handlers = [
	http.get("*/api/health", () => {
		return HttpResponse.json(healthyHealthResponse);
	}),
	http.get("*/api/games", () => {
		const body: GamesListResponse = { games: [...GAMES] };
		return HttpResponse.json(body);
	}),
];
