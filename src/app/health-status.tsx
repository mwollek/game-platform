"use client";

import { useEffect, useState } from "react";

type HealthPayload = {
	status: string;
	service: string;
	timestamp: string;
};

export function HealthStatus() {
	const [payload, setPayload] = useState<HealthPayload | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetch("/api/health")
			.then((res) => {
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				return res.json() as Promise<HealthPayload>;
			})
			.then(setPayload)
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
