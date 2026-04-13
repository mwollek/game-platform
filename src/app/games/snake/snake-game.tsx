"use client";

import { Button } from "@/components/ui/button";
import {
	DEFAULT_GRID_SIZE,
	type Direction,
	type Point,
	type SnakeState,
	createInitialSnakeState,
	stepSnake,
	updateDirection,
} from "@/features/snake/snake-engine";
import { Play, RotateCcw, Sparkles, Trophy } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const CELL_SIZE = 32;
const BOARD_SIZE = DEFAULT_GRID_SIZE * CELL_SIZE;
const TICK_MS = 135;
const GRAVITY = 1100;
/** Delay before win modal so star celebration is visible first (ms). */
const WIN_MODAL_DELAY_MS = 1800;

type GamePhase = "ready" | "playing" | "won" | "lost";

type UiSnapshot = {
	applesEaten: number;
	length: number;
	targetApples: number;
};

type StarParticle = {
	x: number;
	y: number;
	vx: number;
	vy: number;
	spin: number;
	rotation: number;
	size: number;
};

function getDirectionFromKey(key: string): Direction | null {
	const normalized = key.toLowerCase();

	switch (normalized) {
		case "arrowup":
		case "w":
			return "up";
		case "arrowdown":
		case "s":
			return "down";
		case "arrowleft":
		case "a":
			return "left";
		case "arrowright":
		case "d":
			return "right";
		default:
			return null;
	}
}

function toSnapshot(state: SnakeState): UiSnapshot {
	return {
		applesEaten: state.applesEaten,
		length: state.snake.length,
		targetApples: state.targetApples,
	};
}

function createStarsFromSnake(snake: Point[]): StarParticle[] {
	return snake.map((segment, index) => {
		const offset = index - (snake.length - 1) / 2;
		const x = segment.x * CELL_SIZE + CELL_SIZE / 2;
		const y = segment.y * CELL_SIZE + CELL_SIZE / 2;

		return {
			x,
			y,
			vx: offset * 58,
			vy: -(250 + Math.abs(offset) * 22),
			spin: 1.8 + Math.abs(offset) * 0.2,
			rotation: offset * 0.2,
			size: 8.5,
		};
	});
}

function drawStar(
	ctx: CanvasRenderingContext2D,
	particle: StarParticle,
	color = "#fde047",
	stroke = "#f59e0b"
): void {
	const spikes = 5;
	const outerRadius = particle.size;
	const innerRadius = particle.size * 0.45;

	ctx.save();
	ctx.translate(particle.x, particle.y);
	ctx.rotate(particle.rotation);
	ctx.beginPath();

	for (let i = 0; i < spikes * 2; i += 1) {
		const angle = (Math.PI / spikes) * i - Math.PI / 2;
		const radius = i % 2 === 0 ? outerRadius : innerRadius;
		const px = Math.cos(angle) * radius;
		const py = Math.sin(angle) * radius;

		if (i === 0) {
			ctx.moveTo(px, py);
		} else {
			ctx.lineTo(px, py);
		}
	}

	ctx.closePath();
	ctx.fillStyle = color;
	ctx.strokeStyle = stroke;
	ctx.lineWidth = 1.4;
	ctx.fill();
	ctx.stroke();
	ctx.restore();
}

function drawBoardBackground(ctx: CanvasRenderingContext2D, gridSize: number): void {
	const gradient = ctx.createLinearGradient(0, 0, BOARD_SIZE, BOARD_SIZE);
	gradient.addColorStop(0, "#06182f");
	gradient.addColorStop(1, "#0f2740");
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, BOARD_SIZE, BOARD_SIZE);

	ctx.strokeStyle = "rgba(125, 211, 252, 0.12)";
	ctx.lineWidth = 1;
	for (let i = 0; i <= gridSize; i += 1) {
		const p = i * CELL_SIZE;
		ctx.beginPath();
		ctx.moveTo(p, 0);
		ctx.lineTo(p, BOARD_SIZE);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0, p);
		ctx.lineTo(BOARD_SIZE, p);
		ctx.stroke();
	}
}

function drawSnake(ctx: CanvasRenderingContext2D, state: SnakeState): void {
	const appleCenterX = state.apple.x * CELL_SIZE + CELL_SIZE / 2;
	const appleCenterY = state.apple.y * CELL_SIZE + CELL_SIZE / 2;

	ctx.beginPath();
	ctx.fillStyle = "#fb7185";
	ctx.arc(appleCenterX, appleCenterY, CELL_SIZE * 0.34, 0, Math.PI * 2);
	ctx.fill();

	ctx.fillStyle = "#fda4af";
	ctx.beginPath();
	ctx.arc(appleCenterX - 4, appleCenterY - 4, CELL_SIZE * 0.1, 0, Math.PI * 2);
	ctx.fill();

	for (let i = state.snake.length - 1; i >= 0; i -= 1) {
		const segment = state.snake[i];
		const isHead = i === 0;
		ctx.fillStyle = isHead ? "#22d3ee" : "#34d399";
		ctx.fillRect(
			segment.x * CELL_SIZE + 2,
			segment.y * CELL_SIZE + 2,
			CELL_SIZE - 4,
			CELL_SIZE - 4
		);
	}
}

export function SnakeGame() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const frameIdRef = useRef<number | null>(null);
	const lastTimestampRef = useRef<number | null>(null);
	const accumulatorRef = useRef(0);
	const gameStateRef = useRef<SnakeState>(
		createInitialSnakeState(Math.random, DEFAULT_GRID_SIZE)
	);
	const phaseRef = useRef<GamePhase>("ready");
	const starsRef = useRef<StarParticle[]>([]);
	const winModalTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const [snapshot, setSnapshot] = useState<UiSnapshot>(() => toSnapshot(gameStateRef.current));
	const [phase, setPhase] = useState<GamePhase>("ready");
	const [isWinModalOpen, setIsWinModalOpen] = useState(false);

	const clearWinModalTimeout = useCallback(() => {
		if (winModalTimeoutRef.current !== null) {
			window.clearTimeout(winModalTimeoutRef.current);
			winModalTimeoutRef.current = null;
		}
	}, []);

	const stopLoop = useCallback(() => {
		if (frameIdRef.current !== null) {
			window.cancelAnimationFrame(frameIdRef.current);
			frameIdRef.current = null;
		}
		lastTimestampRef.current = null;
		accumulatorRef.current = 0;
	}, []);

	const draw = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) {
			return;
		}

		const ctx = canvas.getContext("2d");
		if (!ctx) {
			return;
		}

		drawBoardBackground(ctx, gameStateRef.current.gridSize);

		if (phaseRef.current === "won") {
			for (const star of starsRef.current) {
				drawStar(ctx, star);
			}
			return;
		}

		drawSnake(ctx, gameStateRef.current);
	}, []);

	const runWinCelebration = useCallback((deltaMs: number): void => {
		const dt = deltaMs / 1000;
		starsRef.current = starsRef.current
			.map((particle) => {
				const vy = particle.vy + GRAVITY * dt;
				return {
					...particle,
					x: particle.x + particle.vx * dt,
					y: particle.y + vy * dt,
					vy,
					rotation: particle.rotation + particle.spin * dt,
				};
			})
			.filter((particle) => particle.y - particle.size <= BOARD_SIZE + 26);
	}, []);

	const triggerWinSequence = useCallback(() => {
		phaseRef.current = "won";
		setPhase("won");
		setIsWinModalOpen(false);
		starsRef.current = createStarsFromSnake(gameStateRef.current.snake);
		clearWinModalTimeout();
		winModalTimeoutRef.current = window.setTimeout(() => {
			winModalTimeoutRef.current = null;
			setIsWinModalOpen(true);
		}, WIN_MODAL_DELAY_MS);
	}, [clearWinModalTimeout]);

	const tick = useCallback(() => {
		gameStateRef.current = stepSnake(gameStateRef.current, Math.random);
		setSnapshot(toSnapshot(gameStateRef.current));

		if (gameStateRef.current.status === "won") {
			triggerWinSequence();
			return;
		}

		if (gameStateRef.current.status === "lost") {
			phaseRef.current = "lost";
			setPhase("lost");
		}
	}, [triggerWinSequence]);

	const gameLoop = useCallback(
		(timestamp: number) => {
			if (lastTimestampRef.current === null) {
				lastTimestampRef.current = timestamp;
			}

			const elapsed = timestamp - lastTimestampRef.current;
			lastTimestampRef.current = timestamp;
			accumulatorRef.current += elapsed;

			if (phaseRef.current === "playing") {
				while (accumulatorRef.current >= TICK_MS && phaseRef.current === "playing") {
					tick();
					accumulatorRef.current -= TICK_MS;
				}
			}

			if (phaseRef.current === "won") {
				runWinCelebration(elapsed);
			}

			draw();

			if (
				phaseRef.current === "playing" ||
				(phaseRef.current === "won" && starsRef.current.length > 0)
			) {
				frameIdRef.current = window.requestAnimationFrame(gameLoop);
				return;
			}

			stopLoop();
		},
		[draw, runWinCelebration, stopLoop, tick]
	);

	const start = useCallback(() => {
		stopLoop();
		clearWinModalTimeout();
		const freshState = createInitialSnakeState(Math.random, DEFAULT_GRID_SIZE);
		gameStateRef.current = freshState;
		phaseRef.current = "playing";
		starsRef.current = [];
		setPhase("playing");
		setIsWinModalOpen(false);
		setSnapshot(toSnapshot(freshState));
		draw();
		frameIdRef.current = window.requestAnimationFrame(gameLoop);
	}, [clearWinModalTimeout, draw, gameLoop, stopLoop]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const nextDirection = getDirectionFromKey(event.key);
			if (!nextDirection) {
				return;
			}

			event.preventDefault();

			if (phaseRef.current !== "playing") {
				return;
			}

			gameStateRef.current = {
				...gameStateRef.current,
				direction: updateDirection(gameStateRef.current.direction, nextDirection),
			};
		};

		window.addEventListener("keydown", handleKeyDown);
		draw();

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			clearWinModalTimeout();
			stopLoop();
		};
	}, [clearWinModalTimeout, draw, stopLoop]);

	return (
		<>
			<section className="relative overflow-hidden rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50/40 to-violet-100/30 p-6 shadow-[0_18px_60px_rgba(14,116,144,0.2)] sm:p-8">
				<div
					className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-cyan-300/25 blur-3xl"
					aria-hidden
				/>
				<div
					className="pointer-events-none absolute -bottom-16 -left-16 h-52 w-52 rounded-full bg-violet-300/20 blur-3xl"
					aria-hidden
				/>

				<div className="relative z-10 space-y-4">
					<div className="flex flex-wrap items-start justify-between gap-3">
						<div className="space-y-1">
							<p className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-cyan-900 ring-1 ring-cyan-200">
								<Sparkles className="size-3.5" />
								Arcade Challenge
							</p>
							<h2 className="text-3xl font-bold text-slate-900">Snake Deluxe</h2>
							<p className="text-base text-slate-600">
								WASD or arrow keys. Collect {snapshot.targetApples} apples before
								touching a wall.
							</p>
						</div>
						<div className="flex gap-2">
							<Button
								type="button"
								variant="outline"
								onClick={start}
								className="bg-white/80"
							>
								<RotateCcw className="mr-1.5 size-4" />
								Restart
							</Button>
						</div>
					</div>

					<div className="flex flex-wrap gap-2 text-base">
						<p className="rounded-full bg-white/80 px-3 py-1 ring-1 ring-cyan-200/80">
							Apples:{" "}
							<span className="font-semibold text-slate-900">
								{snapshot.applesEaten}
							</span>
						</p>
						<p className="rounded-full bg-white/80 px-3 py-1 ring-1 ring-cyan-200/80">
							Length:{" "}
							<span className="font-semibold text-slate-900">{snapshot.length}</span>
						</p>
						<p className="rounded-full bg-white/80 px-3 py-1 ring-1 ring-cyan-200/80">
							State:{" "}
							<span className="font-semibold text-slate-900">
								{phase === "ready" && "Ready"}
								{phase === "playing" && "In Run"}
								{phase === "won" && "Victory"}
								{phase === "lost" && "Defeat"}
							</span>
						</p>
					</div>

					<div className="relative mx-auto w-fit overflow-hidden rounded-2xl border border-cyan-100 bg-[#071a30] p-4 shadow-inner shadow-cyan-900/25">
						<canvas
							ref={canvasRef}
							width={BOARD_SIZE}
							height={BOARD_SIZE}
							className="rounded-xl border border-cyan-200/25"
						/>

						{phase === "ready" ? (
							<div className="absolute inset-3 flex flex-col items-center justify-center gap-4 rounded-xl bg-slate-950/70 text-center backdrop-blur-[1px]">
								<p className="max-w-[250px] text-sm text-cyan-100">
									Take a breath, focus, and press Start when you are ready.
								</p>
								<Button
									type="button"
									onClick={start}
									className="bg-cyan-500 text-white hover:bg-cyan-400"
								>
									<Play className="mr-1.5 size-4" />
									Start run
								</Button>
							</div>
						) : null}
					</div>

					{phase === "lost" ? (
						<p className="rounded-xl border border-rose-200 bg-rose-50/90 px-3 py-2 text-sm text-rose-800">
							Game over. You hit the wall - restart and try a cleaner run.
						</p>
					) : null}
				</div>
			</section>

			{isWinModalOpen ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
					<div className="w-full max-w-md rounded-3xl border border-amber-200 bg-gradient-to-b from-white to-amber-50 p-6 text-center shadow-[0_24px_60px_rgba(15,23,42,0.35)]">
						<div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-amber-100 text-amber-500 ring-4 ring-amber-200/70">
							<Trophy className="size-8" />
						</div>
						<h3 className="text-2xl font-bold text-slate-900">Congratulations!</h3>
						<p className="mt-2 text-sm text-slate-700">
							Great run! You collected all {snapshot.targetApples} apples and won this
							round.
						</p>
						<div className="mt-5 flex justify-center gap-2">
							<Button
								type="button"
								onClick={start}
								className="bg-amber-500 text-white hover:bg-amber-400"
							>
								Play again
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsWinModalOpen(false)}
							>
								Close
							</Button>
						</div>
					</div>
				</div>
			) : null}
		</>
	);
}
