import type { ExitType } from "./layoffSimulation";

export type EmploymentType = "pkwtt" | "pkwt";

export interface EmploymentTermsResponse {
	id: number;
	user_id: number;
	monthly_wage_base: string;
	employment_type: EmploymentType;
	assumed_exit_type: ExitType;
	contract_start_date: string | null;
	contract_end_date: string | null;
	tenure_months: number | null;
	bpjs_tk_active: boolean;
	jkn_active: boolean;
	bpjs_contribution_months_last_24: number;
	bpjs_consecutive_months: number;
	age_years: number | null;
	jht_balance: string | null;
	unused_leave_days: number | null;
	updated_at: string;
}

export interface EmploymentTermsUpsert {
	monthly_wage_base: number | string;
	employment_type?: EmploymentType;
	assumed_exit_type?: ExitType;
	contract_start_date?: string | null;
	contract_end_date?: string | null;
	tenure_months?: number | null;
	bpjs_tk_active?: boolean;
	jkn_active?: boolean;
	bpjs_contribution_months_last_24?: number;
	bpjs_consecutive_months?: number;
	age_years?: number | null;
	jht_balance?: number | string | null;
	unused_leave_days?: number | null;
}
