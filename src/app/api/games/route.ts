import { GAMES } from "@/lib/games";
import type { GamesListResponse } from "@/types/games";
import { NextResponse } from "next/server";

export async function GET(): Promise<Response> {
	const body: GamesListResponse = { games: [...GAMES] };
	return NextResponse.json(body);
}
