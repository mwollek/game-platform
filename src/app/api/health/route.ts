import type { HealthResponse } from "@/types/health";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse<HealthResponse>> {
	const timestamp = new Date().toISOString();
	let database: HealthResponse["database"] = "ok";
	try {
		await prisma.$queryRaw`SELECT 1`;
	} catch {
		database = "error";
	}

	const body: HealthResponse = {
		status: database === "ok" ? "ok" : "degraded",
		service: "game-platform",
		timestamp,
		database,
	};
	return NextResponse.json(body);
}
