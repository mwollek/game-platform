import { describe, expect, it } from "vitest";

import {
	createInitialSnakeState,
	type Point,
	placeApple,
	stepSnake,
	updateDirection,
} from "@/features/snake/snake-engine";

function createSequenceRandom(values: number[]): () => number {
	let idx = 0;
	return () => {
		const value = values[Math.min(idx, values.length - 1)] ?? 0;
		idx += 1;
		return value;
	};
}

describe("snake-engine", () => {
	it("creates an initial playable state", () => {
		const state = createInitialSnakeState(() => 0.1, 10);

		expect(state.status).toBe("playing");
		expect(state.direction).toBe("right");
		expect(state.applesEaten).toBe(0);
		expect(state.targetApples).toBe(5);
		expect(state.snake).toHaveLength(3);
		expect(
			state.snake.some(
				(segment) => segment.x === state.apple.x && segment.y === state.apple.y
			)
		).toBe(false);
	});

	it("moves the snake forward on each step", () => {
		const random = () => 0;
		const state = createInitialSnakeState(random, 10);

		const next = stepSnake(state, random);

		expect(next.snake[0]).toEqual({ x: state.snake[0].x + 1, y: state.snake[0].y });
		expect(next.snake).toHaveLength(3);
	});

	it("sets lost status on wall collision", () => {
		const random = () => 0;
		const state = createInitialSnakeState(random, 4);
		state.snake = [
			{ x: 3, y: 1 },
			{ x: 2, y: 1 },
			{ x: 1, y: 1 },
		];
		state.direction = "right";

		const next = stepSnake(state, random);

		expect(next.status).toBe("lost");
	});

	it("grows by one segment after eating an apple", () => {
		const random = createSequenceRandom([0.5, 0.2]);
		const state = createInitialSnakeState(random, 8);
		const head = state.snake[0];
		state.apple = { x: head.x + 1, y: head.y };

		const next = stepSnake(state, random);

		expect(next.applesEaten).toBe(1);
		expect(next.snake).toHaveLength(state.snake.length + 1);
		expect(next.status).toBe("playing");
	});

	it("wins the round after five apples", () => {
		const random = () => 0;
		const state = createInitialSnakeState(random, 8);
		const head = state.snake[0];
		state.applesEaten = 4;
		state.apple = { x: head.x + 1, y: head.y };

		const next = stepSnake(state, random);

		expect(next.applesEaten).toBe(5);
		expect(next.status).toBe("won");
	});

	it("prevents immediate opposite direction turns", () => {
		expect(updateDirection("right", "left")).toBe("right");
		expect(updateDirection("up", "left")).toBe("left");
	});

	it("places apple only on free cells", () => {
		const snake: Point[] = [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 0, y: 1 },
		];
		const apple = placeApple(2, snake, () => 0.9);

		expect(apple).toEqual({ x: 1, y: 1 });
	});

	it("does not step when game is over", () => {
		const random = () => 0;
		const state = createInitialSnakeState(random, 10);
		state.status = "won";
		const before = state.snake.map((segment) => ({ ...segment }));

		const next = stepSnake(state, random);

		expect(next.snake).toEqual(before);
	});
});
