import { httpClient } from "@/lib/axios";
import type { GamesListResponse } from "@/types/games";

/** Fetches the catalog from `GET /api/games`. */
export async function fetchGames(): Promise<GamesListResponse> {
	const res = await httpClient.get<GamesListResponse>("/api/games");
	return res.data;
}
