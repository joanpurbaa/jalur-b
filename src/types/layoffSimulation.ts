export type LayoffScenario = "tomorrow" | "one_month" | "three_months";

export type ExitType =
	| "efficiency_prevent_loss"
	| "efficiency_due_to_loss"
	| "closure_not_loss"
	| "bankruptcy"
	| "pkwt_ends_on_schedule"
	| "resign";

export interface LayoffSimulationRequest {
	exit_type?: ExitType;
	normative_rights_collectable?: boolean | null;
	search_time_months?: number | string;
	horizon_months?: number | string;
	preferred_role_name?: string | null;
}

export interface LayoffSimulationResult {
	id: number;
	scenario: string;
	simulated_at: string;
	career_readiness_score: string;
	financial_readiness_score: string;
	skill_relevance_score: string;
	job_mobility_score: string;
	overall_resilience_score: string;
	financial_runway_months: string;
	target_runway_months: string;
	financial_gap: string;
	evidence_count: number;
	summary: string;
	action_items: Array<Record<string, unknown>>;
	model: string;
	scoring_version: string;
	exit_type?: ExitType | null;
	regulation_version?: string | null;
	search_time_months?: string | null;
	preparation_time_months?: string | null;
	transition_role_name?: string | null;
	transition_gap_months?: string | null;
	transition_gap_status?: string | null;
	role_transitions?: Array<Record<string, unknown>>;
	insufficient_data?: string[];
}
