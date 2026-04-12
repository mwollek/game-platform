/** Response body for `GET /api/health`. */
export type HealthResponse = {
	status: string;
	service: string;
	timestamp: string;
	/** Whether Prisma could run a trivial query against PostgreSQL. */
	database: "ok" | "error";
};
