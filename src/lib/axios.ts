import axios from "axios";

/** Shared Axios instance for browser and server-side HTTP calls to this app’s API. */
export const http = axios.create({
	headers: { "Content-Type": "application/json" },
});
