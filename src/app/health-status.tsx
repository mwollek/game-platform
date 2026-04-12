"use client";

import { http } from "@/lib/axios";
import type { HealthResponse } from "@/types/health";
import { useEffect, useState } from "react";

export function HealthStatus() {
	const [payload, setPayload] = useState<HealthResponse | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		http.get<HealthResponse>("/api/health")
			.then((res) => setPayload(res.data))
			.catch(() => setError("Failed to load /api/health"));
	}, []);

	const line =
		error ?? (payload ? JSON.stringify(payload, null, 2) : "GET /api/health — loading…");

	return (
		<pre className="health">
			<strong>GET /api/health</strong>
			{"\n"}
			{line}
		</pre>
	);
}
