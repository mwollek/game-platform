import { Button } from "@/components/ui/button";
import { type GameId, GAMES } from "@/lib/games";
import { cn } from "@/lib/utils";
import { CircleDot, Rocket, Worm } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const gameVisual: Record<
	GameId,
	{
		Icon: LucideIcon;
		tileClass: string;
		iconClass: string;
		cardClass: string;
		buttonClass: string;
	}
> = {
	snake: {
		Icon: Worm,
		tileClass:
			"bg-gradient-to-br from-lime-300/50 via-emerald-400/35 to-cyan-500/30 ring-lime-200/55 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35)]",
		iconClass: "text-emerald-950 drop-shadow-sm",
		cardClass:
			"border-emerald-400/25 bg-gradient-to-b from-emerald-500/[0.14] to-cyan-500/[0.06] shadow-[0_8px_30px_-12px_rgba(34,197,94,0.35)]",
		buttonClass:
			"border-emerald-400/55 bg-emerald-500/20 text-emerald-50 hover:bg-emerald-500/30 dark:text-emerald-50",
	},
	"space-invader": {
		Icon: Rocket,
		tileClass:
			"bg-gradient-to-br from-fuchsia-300/45 via-violet-400/40 to-sky-400/35 ring-fuchsia-200/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35)]",
		iconClass: "text-violet-950 drop-shadow-sm",
		cardClass:
			"border-fuchsia-400/25 bg-gradient-to-b from-fuchsia-500/[0.12] to-sky-500/[0.08] shadow-[0_8px_30px_-12px_rgba(168,85,247,0.35)]",
		buttonClass:
			"border-fuchsia-400/55 bg-fuchsia-500/20 text-fuchsia-50 hover:bg-fuchsia-500/30 dark:text-fuchsia-50",
	},
	"ping-pong": {
		Icon: CircleDot,
		tileClass:
			"bg-gradient-to-br from-amber-200/55 via-orange-300/45 to-rose-400/35 ring-amber-100/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)]",
		iconClass: "text-orange-950 drop-shadow-sm",
		cardClass:
			"border-amber-400/30 bg-gradient-to-b from-amber-400/[0.14] to-rose-500/[0.07] shadow-[0_8px_30px_-12px_rgba(251,146,60,0.35)]",
		buttonClass: "border-amber-400/55 bg-amber-500/25 text-amber-50 hover:bg-amber-500/35",
	},
};

export function GamesPanel() {
	return (
		<div data-testid="games-panel" className="space-y-4">
			<div className="space-y-1">
				<h2 className="bg-gradient-to-r from-emerald-300 via-fuchsia-300 to-amber-300 bg-clip-text text-base font-semibold tracking-tight text-transparent sm:text-lg">
					Dostępne gry
				</h2>
				<p className="text-xs text-foreground/75 sm:text-sm">
					Wybierz tytuł poniżej. Implementacja rozgrywki pojawi się w kolejnych
					iteracjach.
				</p>
			</div>
			<ul className={cn("grid gap-3 sm:gap-4", "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3")}>
				{GAMES.map((game) => {
					const { Icon, tileClass, iconClass, cardClass, buttonClass } =
						gameVisual[game.id];
					return (
						<li key={game.id} className="flex h-full min-h-0">
							<article
								className={cn(
									"flex h-full min-h-0 w-full flex-col gap-4 rounded-xl border p-4 backdrop-blur-sm",
									"transition-[border-color,box-shadow,transform] duration-200 sm:p-5",
									"hover:-translate-y-0.5 hover:shadow-lg",
									cardClass
								)}
							>
								<div className="flex min-h-0 gap-3 sm:gap-4">
									<div
										className={cn(
											"flex size-12 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset sm:size-14",
											tileClass
										)}
									>
										<Icon
											className={cn("size-6 sm:size-7", iconClass)}
											strokeWidth={1.75}
											aria-hidden
										/>
									</div>
									<div className="min-w-0 flex-1 space-y-1.5">
										<h3 className="text-base font-semibold leading-snug text-foreground sm:text-[1.05rem]">
											{game.title}
										</h3>
										<p className="text-xs leading-relaxed text-foreground/70 sm:text-sm">
											{game.description}
										</p>
									</div>
								</div>
								<Button
									type="button"
									variant="outline"
									className={cn(
										"mt-auto w-full border-2 font-medium shadow-sm",
										"disabled:pointer-events-none disabled:opacity-80",
										buttonClass
									)}
									disabled
									aria-disabled
								>
									Wkrótce
								</Button>
							</article>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
