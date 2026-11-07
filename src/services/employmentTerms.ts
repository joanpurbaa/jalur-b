import { request } from "./http";
import type {
	EmploymentTermsResponse,
	EmploymentTermsUpsert,
} from "../types/employmentTerms";

export const employmentTermsApi = {
	get: () =>
		request<EmploymentTermsResponse>("/api/financial/employment-terms", {
			auth: true,
		}),

	upsert: (payload: EmploymentTermsUpsert) =>
		request<EmploymentTermsResponse>("/api/financial/employment-terms", {
			method: "PUT",
			body: payload,
			auth: true,
		}),
};
