import { NextResponse } from "next/server";

export function GET() {
	return NextResponse.json({
		status: "ok",
		service: "game-platform",
		timestamp: new Date().toISOString(),
	});
}
