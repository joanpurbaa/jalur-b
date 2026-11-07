export class ApiError extends Error {
	status: number;
	code?: string;
	missing?: string[];
	data?: unknown;

	constructor(message: string, status: number, data?: unknown) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.data = data;

		if (data && typeof data === "object") {
			const detail = (data as { detail?: unknown }).detail;
			if (detail && typeof detail === "object") {
				const d = detail as Record<string, unknown>;
				if (typeof d.code === "string") {
					this.code = d.code;
				}
				if (Array.isArray(d.missing)) {
					this.missing = d.missing.map(String);
				}
			}
		}
	}
}

export interface MessageResponse {
	message: string;
}

/** Paginated list response used by master-data endpoints. */
export interface Page<T> {
	items: T[];
	total: number;
	limit: number;
	offset: number;
}
