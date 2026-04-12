import { HealthStatus } from "./health-status";

export default function Home() {
	return (
		<main>
			<h1>Hello — Game Platform</h1>
			<p>A minimal shell for simple 2D browser games. Health API is wired below.</p>
			<HealthStatus />
		</main>
	);
}
