"use client";

import type { GameListItem } from "@/lib/games";
import { fetchGames } from "@/services/games";
import { useCallback, useEffect, useState } from "react";

const GAMES_FETCH_ERROR = "Failed to load /api/games";

export type UseGamesResult = {
	games: GameListItem[];
	error: string | null;
	isLoading: boolean;
	refresh: () => Promise<void>;
};

export function useGames(): UseGamesResult {
	const [games, setGames] = useState<GameListItem[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const refresh = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const data = await fetchGames();
			setGames(data.games);
		} catch {
			setError(GAMES_FETCH_ERROR);
			setGames([]);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void refresh();
	}, [refresh]);

	return { games, error, isLoading, refresh };
}
