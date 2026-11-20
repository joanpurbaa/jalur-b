export type CreditFeatureId =
	| "compare_roles"
	| "skill_gap_map"
	| "ai_exposure_detail"
	| "re_assessment"
	| "monthly_runway_projection"
	| "reimport_cv";

export type EmploymentStatus = "working" | "stopped" | "never_worked";

export interface CreditFeatureMeta {
	id: CreditFeatureId;
	label: string;
	cost: number;
	description: string;
}

export const CREDIT_FEATURES: Record<CreditFeatureId, CreditFeatureMeta> = {
	compare_roles: {
		id: "compare_roles",
		label: "Bandingkan peran lain",
		cost: 3,
		description:
			"Sekali buka langsung membuka seluruh kartu detail hasil simulasi: perbandingan lintas peran, 5 indikator kesiapan, opsi pivot, skill prioritas, garis waktu ketahanan, dan rencana aksi.",
	},
	skill_gap_map: {
		id: "skill_gap_map",
		label: "Peta skill gap (peran ke-2 dst.)",
		cost: 5,
		description:
			"Buka rincian skill jembatan dan estimasi persiapan untuk seluruh peran alternatif di luar peran utama pertamamu.",
	},
	ai_exposure_detail: {
		id: "ai_exposure_detail",
		label: "Rincian AI exposure per aktivitas",
		cost: 1,
		description:
			"Lihat rincian skor paparan otomatisasi AI dan penjelasan dampak untuk setiap aktivitas kerja harianmu.",
	},
	re_assessment: {
		id: "re_assessment",
		label: "Analisis ulang assessment",
		cost: 2,
		description:
			"Jalankan pembaruan analisis Kesehatan Karier, Risiko, Skill & AI, dan Jalur Karier di luar kuota gratis 1x/bulan.",
	},
	monthly_runway_projection: {
		id: "monthly_runway_projection",
		label: "Proyeksi runway per bulan",
		cost: 1,
		description:
			"Pantau rincian sisa dana likuid bulan demi bulan berdasarkan pengeluaran esensial dan kewajiban rutinmu.",
	},
	reimport_cv: {
		id: "reimport_cv",
		label: "Impor CV ulang",
		cost: 2,
		description:
			"Unggah dan ekstrak ulang dokumen CV terbarumu untuk memperbarui timeline pengalaman dan koleksi skill.",
	},
};

export interface SalaryTier {
	id: string;
	label: string;
	rangeLabel: string;
	minSalary: number;
	maxSalary: number | null;
	pricePerCredit: number;
	packPrice: number;
	packCredits: number;
	description: string;
}

export const SALARY_TIERS: SalaryTier[] = [
	{
		id: "tier_1",
		label: "Kelompok 1",
		rangeLabel: "< Rp5 juta / bln",
		minSalary: 0,
		maxSalary: 5_000_000,
		pricePerCredit: 300,
		packPrice: 6_000,
		packCredits: 20,
		description: "Tarif ramah untuk pekerja awal & UMR.",
	},
	{
		id: "tier_2",
		label: "Kelompok 2",
		rangeLabel: "Rp5 – 10 juta / bln",
		minSalary: 5_000_000,
		maxSalary: 10_000_000,
		pricePerCredit: 750,
		packPrice: 15_000,
		packCredits: 20,
		description: "Tarif proporsional untuk profesional menengah awal.",
	},
	{
		id: "tier_3",
		label: "Kelompok 3",
		rangeLabel: "Rp10 – 20 juta / bln",
		minSalary: 10_000_000,
		maxSalary: 20_000_000,
		pricePerCredit: 1_600,
		packPrice: 32_000,
		packCredits: 20,
		description: "Untuk spesialis & senior dengan kebutuhan transisi kompleks.",
	},
	{
		id: "tier_4",
		label: "Kelompok 4",
		rangeLabel: "> Rp20 juta / bln",
		minSalary: 20_000_000,
		maxSalary: null,
		pricePerCredit: 2_000,
		packPrice: 40_000,
		packCredits: 20,
		description: "Tarif penuh untuk lead, manager, dan eksekutif.",
	},
];

export function detectSalaryTier(
	monthlyWage: number | null | undefined,
): string | null {
	if (
		monthlyWage == null ||
		!Number.isFinite(monthlyWage) ||
		monthlyWage <= 0
	) {
		return null;
	}
	for (const tier of SALARY_TIERS) {
		if (
			monthlyWage >= tier.minSalary &&
			(tier.maxSalary === null || monthlyWage < tier.maxSalary)
		) {
			return tier.id;
		}
	}
	return SALARY_TIERS[SALARY_TIERS.length - 1].id;
}
