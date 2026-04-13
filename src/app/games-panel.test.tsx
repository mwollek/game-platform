import { render, screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { GamesPanel } from "@/app/games-panel";
import { GAMES } from "@/lib/games";
import { server } from "@/test/msw/server";

describe("GamesPanel", () => {
	it("loads game titles from GET /api/games", async () => {
		render(<GamesPanel />);

		for (const game of GAMES) {
			await screen.findByRole("heading", { name: game.title });
		}
	});

	it("shows loading state until games endpoint responds", async () => {
		let release = () => {};
		const blocker = new Promise<void>((resolve) => {
			release = resolve;
		});

		server.use(
			http.get("*/api/games", async () => {
				await blocker;
				return HttpResponse.json({ games: [...GAMES] });
			})
		);

		render(<GamesPanel />);

		expect(screen.getByTestId("games-panel-loading")).toBeTruthy();

		release();
		await screen.findByRole("heading", { name: GAMES[0].title });
		expect(screen.queryByTestId("games-panel-loading")).toBeNull();
	});

	it("shows an error when games request fails", async () => {
		server.use(
			http.get("*/api/games", () => {
				return HttpResponse.error();
			})
		);

		render(<GamesPanel />);

		await screen.findByText("Failed to load /api/games");
	});
});
