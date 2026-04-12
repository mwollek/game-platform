import { render, screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { HealthStatus } from "@/app/health-status";
import { server } from "@/test/msw/server";

function createBlocker() {
	let release = () => {};
	const promise = new Promise<void>((resolve) => {
		release = resolve;
	});
	return { promise, release };
}

describe("HealthStatus", () => {
	it("shows green panel when health status is ok", async () => {
		render(<HealthStatus />);

		await screen.findByText("🟢 API online");

		const panel = screen.getByTestId("health-panel");
		expect(panel.className).toContain("border-emerald-200");
		expect(panel.className).not.toContain("border-red-200");
	});

	it("shows loading state until endpoint responds", async () => {
		const blocker = createBlocker();

		server.use(
			http.get("*/api/health", async () => {
				await blocker.promise;
				return HttpResponse.json({
					status: "ok",
					service: "game-platform",
					timestamp: "2026-01-01T00:00:00.000Z",
				});
			})
		);

		render(<HealthStatus />);

		expect(screen.getByText("checking")).toBeTruthy();
		expect(screen.getByText("GET /api/health - loading...")).toBeTruthy();
		expect(screen.getByRole("button", { name: "Refreshing..." })).toBeTruthy();

		blocker.release();

		await screen.findByText("🟢 API online");
		expect(screen.queryByText("checking")).toBeNull();
	});

	it("shows red panel when service is not healthy", async () => {
		server.use(
			http.get("*/api/health", () => {
				return HttpResponse.json({
					status: "degraded",
					service: "game-platform",
					timestamp: "2026-01-01T00:00:00.000Z",
				});
			})
		);

		render(<HealthStatus />);

		await screen.findByText("degraded");

		const panel = screen.getByTestId("health-panel");
		expect(panel.className).toContain("border-red-200");
		expect(panel.className).not.toContain("border-emerald-200");
	});
});
