import type { HealthResponse } from "@/types/health";
import { NextResponse } from "next/server";

export function GET(): NextResponse<HealthResponse> {
	const body: HealthResponse = {
		status: "ok",
		service: "game-platform",
		timestamp: new Date().toISOString(),
	};
	return NextResponse.json(body);
}
