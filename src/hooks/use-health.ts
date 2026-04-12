"use client";

import { fetchHealth } from "@/services/health";
import type { HealthResponse } from "@/types/health";
import { useCallback, useEffect, useState } from "react";

const HEALTH_FETCH_ERROR = "Failed to load /api/health";

export type UseHealthResult = {
	payload: HealthResponse | null;
	error: string | null;
	isLoading: boolean;
	refresh: () => Promise<void>;
};

export function useHealth(): UseHealthResult {
	const [payload, setPayload] = useState<HealthResponse | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const refresh = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const data = await fetchHealth();
			setPayload(data);
		} catch {
			setError(HEALTH_FETCH_ERROR);
			setPayload(null);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void refresh();
	}, [refresh]);

	return { payload, error, isLoading, refresh };
}
