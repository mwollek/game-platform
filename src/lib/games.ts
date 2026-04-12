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
		description: "Classic snake on a grid - collect, grow, and avoid collisions.",
	},
	{
		id: "space-invader",
		title: "Space Invader",
		description: "Defend against waves of aliens - shoot and survive each level.",
	},
	{
		id: "ping-pong",
		title: "Ping Pong",
		description: "Two paddles and one ball - reflexes and precision in a 1v1 match.",
	},
];
