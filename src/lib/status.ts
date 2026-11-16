export type StatusVariant =
	| "healthy"
	| "warning"
	| "risk"
	| "insight"
	| "neutral";

export const statusStyles: Record<
	StatusVariant,
	{ text: string; bg: string; border: string; bar: string; iconBg: string }
> = {
	healthy: {
		text: "text-emerald-600",
		bg: "bg-emerald-50",
		border: "border-emerald-200",
		bar: "bg-emerald-500",
		iconBg: "bg-emerald-50",
	},
	warning: {
		text: "text-amber-600",
		bg: "bg-amber-50",
		border: "border-amber-200",
		bar: "bg-amber-500",
		iconBg: "bg-amber-50",
	},
	risk: {
		text: "text-rose-600",
		bg: "bg-rose-50",
		border: "border-rose-200",
		bar: "bg-rose-500",
		iconBg: "bg-rose-50",
	},
	insight: {
		text: "text-primary",
		bg: "bg-primary/5",
		border: "border-primary/20",
		bar: "bg-primary",
		iconBg: "bg-primary/10",
	},
	neutral: {
		text: "text-neutral/60",
		bg: "bg-neutral/5",
		border: "border-neutral/10",
		bar: "bg-neutral/40",
		iconBg: "bg-neutral/10",
	},
};

export function getScoreStatus(score: number): StatusVariant {
	if (score >= 75) return "healthy";
	if (score >= 60) return "warning";
	return "risk";
}

export type RiskLevel = "Rendah" | "Sedang" | "Tinggi";

export function normalizeRiskLevel(
	value: string | null | undefined,
): RiskLevel {
	const v = (value ?? "").toLowerCase();
	if (v.includes("rendah") || v.includes("low")) return "Rendah";
	if (v.includes("tinggi") || v.includes("high")) return "Tinggi";
	return "Sedang";
}

export function getLevelStatus(level: RiskLevel): StatusVariant {
	if (level === "Rendah") return "healthy";
	if (level === "Sedang") return "warning";
	return "risk";
}

export type FinanceTone = "indigo" | "violet" | "rose" | "amber" | "slate";

/* ------------------------------------------------------------------ */
/* Meta status untuk presentasi: label + hex. Status tidak boleh hanya */
/* mengandalkan warna — komponen StatusBadge/ikon memakai meta ini.    */
/* ------------------------------------------------------------------ */
export const statusMeta: Record<
	StatusVariant,
	{ label: string; hex: string; hex2: string; soft: string }
> = {
	healthy: { label: "Aman", hex: "#10b981", hex2: "#34d399", soft: "#d1fae5" },
	warning: {
		label: "Perlu perhatian",
		hex: "#f59e0b",
		hex2: "#fbbf24",
		soft: "#fef3c7",
	},
	risk: { label: "Perlu ditingkatkan", hex: "#f43f5e", hex2: "#fb7185", soft: "#ffe4e6" },
	insight: { label: "Insight", hex: "#6366f1", hex2: "#818cf8", soft: "#e0e7ff" },
	neutral: { label: "Belum ada data", hex: "#94a3b8", hex2: "#cbd5e1", soft: "#f1f5f9" },
};

/**
 * Status runway relatif terhadap target (presentasi). Di atas/sama dengan
 * target = aman; ≥ 60% target = perhatian; di bawahnya = prioritas.
 */
export function getRunwayStatus(current: number, target: number): StatusVariant {
	if (!Number.isFinite(current)) return "neutral";
	if (!target || target <= 0) {
		if (current >= 6) return "healthy";
		if (current >= 3) return "warning";
		return "risk";
	}
	if (current >= target) return "healthy";
	if (current >= target * 0.6) return "warning";
	return "risk";
}

/** Untuk skor di mana makin TINGGI makin berisiko (risiko, AI exposure). */
export function getInverseScoreStatus(score: number): StatusVariant {
	if (score >= 67) return "risk";
	if (score >= 34) return "warning";
	return "healthy";
}


export const financeToneStyles: Record<
	FinanceTone,
	{ iconBg: string; iconText: string }
> = {
	indigo: { iconBg: "bg-indigo-50", iconText: "text-indigo-600" },
	violet: { iconBg: "bg-violet-50", iconText: "text-violet-600" },
	rose: { iconBg: "bg-rose-50", iconText: "text-rose-600" },
	amber: { iconBg: "bg-amber-50", iconText: "text-amber-600" },
	slate: { iconBg: "bg-slate-100", iconText: "text-slate-600" },
};
