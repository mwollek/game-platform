import { Button } from "@/components/ui/button";
import { type GameId, GAMES } from "@/lib/games";
import { cn } from "@/lib/utils";

const gameVisual: Record<
	GameId,
	{
		emoji: string;
		tagline: string;
		badge: string;
		badgeClass: string;
		tileClass: string;
		iconClass: string;
		cardClass: string;
		buttonClass: string;
	}
> = {
	snake: {
		emoji: "🐍",
		tagline: "A classic that still pulls you in.",
		badge: "hot",
		badgeClass: "bg-emerald-100 text-emerald-700",
		tileClass: "bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 ring-emerald-200",
		iconClass: "drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]",
		cardClass:
			"border-emerald-200 bg-gradient-to-b from-emerald-50 to-cyan-50 shadow-[0_8px_20px_rgba(16,185,129,0.14)]",
		buttonClass: "border-emerald-300 bg-white/80 text-emerald-900 hover:bg-emerald-100",
	},
	"space-invader": {
		emoji: "👾",
		tagline: "Retro vibes and quick fingers.",
		badge: "new",
		badgeClass: "bg-violet-100 text-violet-700",
		tileClass: "bg-gradient-to-br from-fuchsia-100 via-violet-100 to-sky-100 ring-violet-200",
		iconClass: "drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]",
		cardClass:
			"border-violet-200 bg-gradient-to-b from-violet-50 to-sky-50 shadow-[0_8px_20px_rgba(139,92,246,0.14)]",
		buttonClass: "border-violet-300 bg-white/80 text-violet-900 hover:bg-violet-100",
	},
	"ping-pong": {
		emoji: "🏓",
		tagline: "1v1 matches and pure focus.",
		badge: "2P",
		badgeClass: "bg-amber-100 text-amber-700",
		tileClass: "bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 ring-amber-200",
		iconClass: "drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]",
		cardClass:
			"border-amber-200 bg-gradient-to-b from-amber-50 to-rose-50 shadow-[0_8px_20px_rgba(251,146,60,0.15)]",
		buttonClass: "border-amber-300 bg-white/80 text-amber-900 hover:bg-amber-100",
	},
};

export function GamesPanel() {
	return (
		<div data-testid="games-panel" className="space-y-4">
			<div className="space-y-1">
				<h2 className="bg-gradient-to-r from-emerald-500 via-violet-500 to-amber-500 bg-clip-text text-base font-semibold tracking-tight text-transparent sm:text-lg">
					Available Games
				</h2>
				<p className="text-xs text-slate-600 sm:text-sm">
					Jump in, beat your high score, and play a quick match.
				</p>
			</div>
			<ul className={cn("grid gap-3 sm:gap-4", "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3")}>
				{GAMES.map((game) => {
					const {
						emoji,
						tagline,
						badge,
						badgeClass,
						tileClass,
						iconClass,
						cardClass,
						buttonClass,
					} = gameVisual[game.id];
					return (
						<li key={game.id} className="flex h-full min-h-0">
							<article
								className={cn(
									"flex h-full min-h-0 w-full flex-col gap-4 rounded-2xl border p-4",
									"transition-[border-color,box-shadow,transform] duration-200 sm:p-5",
									"hover:-translate-y-0.5 hover:shadow-xl",
									cardClass
								)}
							>
								<div className="flex min-h-0 gap-3 sm:gap-4">
									<div
										className={cn(
											"flex size-12 shrink-0 items-center justify-center rounded-2xl ring-1 ring-inset sm:size-14",
											tileClass
										)}
									>
										<span
											className={cn("text-2xl sm:text-3xl", iconClass)}
											aria-hidden
										>
											{emoji}
										</span>
									</div>
									<div className="min-w-0 flex-1 space-y-1.5">
										<div className="flex items-center justify-between gap-2">
											<h3 className="text-base font-semibold leading-snug text-slate-900 sm:text-[1.05rem]">
												{game.title}
											</h3>
											<span
												className={cn(
													"rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
													badgeClass
												)}
											>
												{badge}
											</span>
										</div>
										<p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
											{tagline}
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
									Coming Soon
								</Button>
							</article>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
