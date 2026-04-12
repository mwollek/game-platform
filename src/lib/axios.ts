import axios from "axios";

/** Shared Axios instance for browser and server-side HTTP calls to this app’s API. */
export const httpClient = axios.create({
	headers: { "Content-Type": "application/json" },
});
