import { request } from "./http";
import type {
	LayoffSimulationRequest,
	LayoffSimulationResult,
} from "../types/layoffSimulation";

export const layoffSimulationApi = {
	create: (data?: LayoffSimulationRequest) =>
		request<LayoffSimulationResult>("/api/layoff-simulations", {
			method: "POST",
			body: data ?? {},
			auth: true,
		}),

	latest: () =>
		request<LayoffSimulationResult>("/api/layoff-simulations/latest", {
			auth: true,
		}),

	get: (simulationId: number) =>
		request<LayoffSimulationResult>(`/api/layoff-simulations/${simulationId}`, {
			auth: true,
		}),
};
