export type GameId = "snake" | "space-invader" | "ping-pong";

export type GameListItem = {
	id: GameId;
	title: string;
	description: string;
};

export const GAMES: readonly GameListItem[] = [
	{
		id: "snake",
		title: "Snake",
		description: "Klasyczny wąż na planszy — zbieraj, rośnij, unikaj kolizji.",
	},
	{
		id: "space-invader",
		title: "Space Invader",
		description: "Obrona przed falami obcych — strzelaj i przetrwaj kolejne poziomy.",
	},
	{
		id: "ping-pong",
		title: "Ping pong",
		description: "Dwie paletki i piłka — refleks i precyzja w rozgrywce 1 na 1.",
	},
];
