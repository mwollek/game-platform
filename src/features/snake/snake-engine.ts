export type Point = {
	x: number;
	y: number;
};

export type Direction = "up" | "down" | "left" | "right";

export type SnakeStatus = "idle" | "playing" | "won" | "lost";

export type SnakeState = {
	gridSize: number;
	snake: Point[];
	direction: Direction;
	apple: Point;
	applesEaten: number;
	targetApples: number;
	status: SnakeStatus;
};

export type RandomSource = () => number;

export const DEFAULT_GRID_SIZE = 16;
export const DEFAULT_TARGET_APPLES = 5;

const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
	up: "down",
	down: "up",
	left: "right",
	right: "left",
};

function pointsEqual(a: Point, b: Point): boolean {
	return a.x === b.x && a.y === b.y;
}

function getNextHeadPosition(head: Point, direction: Direction): Point {
	switch (direction) {
		case "up":
			return { x: head.x, y: head.y - 1 };
		case "down":
			return { x: head.x, y: head.y + 1 };
		case "left":
			return { x: head.x - 1, y: head.y };
		case "right":
			return { x: head.x + 1, y: head.y };
	}
}

function isOutOfBounds(point: Point, gridSize: number): boolean {
	return point.x < 0 || point.y < 0 || point.x >= gridSize || point.y >= gridSize;
}

export function placeApple(gridSize: number, snake: Point[], random: RandomSource): Point {
	const occupied = new Set(snake.map((segment) => `${segment.x}:${segment.y}`));
	const freeCells: Point[] = [];

	for (let y = 0; y < gridSize; y += 1) {
		for (let x = 0; x < gridSize; x += 1) {
			if (!occupied.has(`${x}:${y}`)) {
				freeCells.push({ x, y });
			}
		}
	}

	if (freeCells.length === 0) {
		return { x: 0, y: 0 };
	}

	const index = Math.floor(random() * freeCells.length);
	return freeCells[Math.min(index, freeCells.length - 1)];
}

export function createInitialSnakeState(
	random: RandomSource,
	gridSize = DEFAULT_GRID_SIZE
): SnakeState {
	const center = Math.floor(gridSize / 2);
	const snake: Point[] = [
		{ x: center, y: center },
		{ x: center - 1, y: center },
		{ x: center - 2, y: center },
	];

	return {
		gridSize,
		snake,
		direction: "right",
		apple: placeApple(gridSize, snake, random),
		applesEaten: 0,
		targetApples: DEFAULT_TARGET_APPLES,
		status: "playing",
	};
}

export function updateDirection(current: Direction, next: Direction): Direction {
	if (OPPOSITE_DIRECTION[current] === next) {
		return current;
	}

	return next;
}

export function stepSnake(state: SnakeState, random: RandomSource): SnakeState {
	if (state.status !== "playing") {
		return state;
	}

	const currentHead = state.snake[0];
	const nextHead = getNextHeadPosition(currentHead, state.direction);

	if (isOutOfBounds(nextHead, state.gridSize)) {
		return {
			...state,
			status: "lost",
		};
	}

	const didEatApple = pointsEqual(nextHead, state.apple);
	const movedSnake = [nextHead, ...state.snake];
	const nextSnake = didEatApple ? movedSnake : movedSnake.slice(0, -1);

	if (!didEatApple) {
		return {
			...state,
			snake: nextSnake,
		};
	}

	const applesEaten = state.applesEaten + 1;
	const wonRound = applesEaten >= state.targetApples;

	return {
		...state,
		snake: nextSnake,
		applesEaten,
		status: wonRound ? "won" : "playing",
		apple: wonRound ? state.apple : placeApple(state.gridSize, nextSnake, random),
	};
}
