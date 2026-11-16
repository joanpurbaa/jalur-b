export type StatusVariant =
	| "healthy"
	| "warning"
	| "risk"
	| "insight"
	| "neutral";

/**
 * Gaya status muted: warna lain hanya untuk makna status data
 * (hijau = aman, amber = perlu perhatian, merah = kritis).
 */
export const statusStyles: Record<
	StatusVariant,
	{
		text: string;
		bg: string;
		border: string;
		bar: string;
		dot: string;
		iconBg: string;
	}
> = {
	healthy: {
		text: "text-emerald-800",
		bg: "bg-emerald-50/80",
		border: "border-emerald-200/80",
		bar: "bg-emerald-600",
		dot: "bg-emerald-500",
		iconBg: "bg-emerald-50",
	},
	warning: {
		text: "text-amber-800",
		bg: "bg-amber-50/80",
		border: "border-amber-200/80",
		bar: "bg-amber-500",
		dot: "bg-amber-500",
		iconBg: "bg-amber-50",
	},
	risk: {
		text: "text-rose-800",
		bg: "bg-rose-50/80",
		border: "border-rose-200/80",
		bar: "bg-rose-600",
		dot: "bg-rose-500",
		iconBg: "bg-rose-50",
	},
	insight: {
		text: "text-indigo-700",
		bg: "bg-indigo-50/80",
		border: "border-indigo-200/80",
		bar: "bg-indigo-600",
		dot: "bg-indigo-600",
		iconBg: "bg-indigo-50",
	},
	neutral: {
		text: "text-slate-600",
		bg: "bg-slate-100/80",
		border: "border-slate-200",
		bar: "bg-slate-400",
		dot: "bg-slate-400",
		iconBg: "bg-slate-100",
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

/**
 * Pemetaan status Kesehatan Karier berdasarkan label status/level dari data API
 * terlebih dahulu agar "Perlu Perhatian" / "Cukup" / "Sedang" selalu tampil
 * sebagai amber (bukan merah yang menakutkan). Merah hanya untuk label kritis.
 */
export function getHealthStatus(
	statusOrLevel: string | null | undefined,
	scoreFallback?: number,
): StatusVariant {
	const v = (statusOrLevel ?? "").toLowerCase().trim();
	if (
		v.includes("sehat") ||
		v.includes("aman") ||
		v.includes("kuat") ||
		v.includes("baik") ||
		v.includes("stabil") ||
		v.includes("optimal") ||
		v.includes("healthy") ||
		v.includes("strong") ||
		v.includes("good")
	) {
		return "healthy";
	}
	if (
		v.includes("kritis") ||
		v.includes("bahaya") ||
		v.includes("critical") ||
		v.includes("buruk") ||
		v.includes("rentan") ||
		v.includes("lemah")
	) {
		return "risk";
	}
	if (
		v.includes("perhatian") ||
		v.includes("waspada") ||
		v.includes("sedang") ||
		v.includes("cukup") ||
		v.includes("menengah") ||
		v.includes("perlu diperkuat") ||
		v.includes("medium") ||
		v.includes("moderate")
	) {
		return "warning";
	}
	if (v.includes("rendah") || v.includes("low")) {
		return "warning";
	}
	if (scoreFallback != null) {
		return getScoreStatus(scoreFallback);
	}
	return "neutral";
}

/** Lokalkan label Inggris umum (low/medium/high) ke Bahasa Indonesia di tampilan. */
export function localizeLevelLabel(value: string | null | undefined): string {
	const raw = (value ?? "").trim();
	if (!raw) return "—";
	const v = raw.toLowerCase();
	if (v === "low" || v.includes("rendah")) return "Rendah";
	if (v === "medium" || v === "moderate" || v.includes("sedang"))
		return "Sedang";
	if (v === "high" || v.includes("tinggi")) return "Tinggi";
	if (v === "strong") return "Kuat";
	if (v === "weak") return "Perlu diperkuat";
	if (v === "healthy") return "Sehat";
	if (v === "warning") return "Perlu perhatian";
	if (v === "critical") return "Kritis";
	return raw;
}

/** Normalisasi data_confidence (bisa datang 0..1 atau 0..100 dari API). */
export function normalizeConfidence(raw: string | number | null | undefined): number {
	const n = typeof raw === "number" ? raw : Number(raw);
	if (!Number.isFinite(n) || n <= 0) return 0;
	const pct = n <= 1 ? n * 100 : n;
	return Math.min(100, Math.max(0, Math.round(pct)));
}

export type FinanceTone = "indigo" | "violet" | "rose" | "amber" | "slate";

export const statusMeta: Record<
	StatusVariant,
	{ label: string; hex: string; hex2: string; soft: string }
> = {
	healthy: { label: "Aman", hex: "#059669", hex2: "#10b981", soft: "#ecfdf5" },
	warning: {
		label: "Perlu perhatian",
		hex: "#d97706",
		hex2: "#f59e0b",
		soft: "#fffbeb",
	},
	risk: {
		label: "Kritis",
		hex: "#e11d48",
		hex2: "#f43f5e",
		soft: "#fff1f2",
	},
	insight: {
		label: "Insight",
		hex: "#4f46e5",
		hex2: "#6366f1",
		soft: "#eef2ff",
	},
	neutral: {
		label: "Belum ada data",
		hex: "#64748b",
		hex2: "#94a3b8",
		soft: "#f1f5f9",
	},
};

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

export function getInverseScoreStatus(score: number): StatusVariant {
	if (score >= 67) return "risk";
	if (score >= 34) return "warning";
	return "healthy";
}

export const financeToneStyles: Record<
	FinanceTone,
	{ iconBg: string; iconText: string }
> = {
	indigo: { iconBg: "bg-slate-100", iconText: "text-slate-600" },
	violet: { iconBg: "bg-slate-100", iconText: "text-slate-600" },
	rose: { iconBg: "bg-slate-100", iconText: "text-slate-600" },
	amber: { iconBg: "bg-slate-100", iconText: "text-slate-600" },
	slate: { iconBg: "bg-slate-100", iconText: "text-slate-600" },
};
