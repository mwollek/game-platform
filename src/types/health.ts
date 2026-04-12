/** Response body for `GET /api/health`. */
export type HealthResponse = {
	status: string;
	service: string;
	timestamp: string;
};
