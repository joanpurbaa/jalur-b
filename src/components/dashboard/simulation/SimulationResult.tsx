import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
	Activity,
	AlarmClock,
	AlertCircle,
	AlertTriangle,
	ArrowRight,
	CalendarClock,
	CalendarRange,
	Check,
	CheckCircle2,
	CheckSquare,
	Coins,
	Compass,
	FileCheck2,
	FolderCheck,
	Gift,
	HeartPulse,
	Lock,
	RotateCcw,
	Scale,
	Share2,
	ShieldAlert,
	ShieldCheck,
	Target,
	TrendingDown,
	Wallet as WalletIcon,
	X,
	Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
	getHealthStatus,
	getRunwayStatus,
	getScoreStatus,
	statusStyles,
} from "../../../lib/status";
import {
	formatDateID,
	formatDecimal1,
	formatMonths,
} from "../../../lib/format";
import ScoreRing from "../../ui/ScoreRing";
import MeterBar from "../../ui/MeterBar";
import StatusBadge from "../../ui/StatusBadge";
import Card from "../../ui/Card";
import IconTile from "../../ui/IconTile";
import LockedPreviewCard from "../../ui/LockedPreviewCard";
import {
	PrimaryButton,
	SecondaryButton,
} from "../../ui/PrimaryButton";
import { CountUp, Stagger, StaggerItem } from "../../ui/Motion";
import ResultTimeline from "./ResultTimeline";
import { careerPivotApi } from "../../../services/careerPivot";
import { aiExposureApi } from "../../../services/aiExposure";
import { parseDecimal } from "../../../lib/parseNumeric";
import { useCredits } from "../../../context/CreditsContext";
import type { LayoffSimulationResult } from "../../../types/layoffSimulation";

interface ReadinessItem {
	label: string;
	value: number;
	icon: LucideIcon;
	hasStatus: boolean;
}

interface PivotComparisonRow {
	role: string;
	match: number | null;
	prepMonths: number;
	gapMonths: number;
}

type OutcomeTier = "deficit" | "thin_surplus" | "stable";

const scenarioLabels: Record<string, string> = {
	tomorrow: "Besok",
	one_month: "1 Bulan Lagi",
	three_months: "3 Bulan Lagi",
};

const exitTypeLabels: Record<string, string> = {
	efficiency_due_to_loss: "Efisiensi karena Rugi",
	efficiency_prevent_loss: "Efisiensi Cegah Rugi",
	closure_not_loss: "Penutupan Perusahaan",
	bankruptcy: "Kepailitan",
	pkwt_ends_on_schedule: "PKWT Berakhir",
	resign: "Resign Sukarela",
};

const INSUFFICIENT_LABELS: Record<string, string> = {
	liquid_assets: "Tabungan / dana likuid",
	monthly_essential_expenses: "Pengeluaran esensial bulanan",
	monthly_debt_payment: "Cicilan rutin bulanan",
	monthly_wage_base: "Upah pokok bulanan",
	employment_terms: "Ketentuan kerja (PKWTT/PKWT & masa kerja)",
	financial_profile: "Profil finansial bulanan",
	financial_assets: "Daftar aset & dana darurat",
	career_pivot: "Pemetaan jalur peran alternatif",
};

/** Data statis dummy khusus untuk pratinjau kartu terkunci — diganti penuh dengan data real saat unlocked. */
const DUMMY_COMPARISON_ROWS: PivotComparisonRow[] = [
	{ role: "Product Analyst", match: 82, prepMonths: 2, gapMonths: 2.4 },
	{ role: "Business Operations", match: 76, prepMonths: 3, gapMonths: 1.1 },
	{ role: "Project Coordinator", match: 71, prepMonths: 4, gapMonths: -0.8 },
];

const DUMMY_PIVOT_ROLES = [
	{ role: "Product Analyst", match: 82 },
	{ role: "Business Operations", match: 76 },
	{ role: "Project Coordinator", match: 71 },
	{ role: "Growth Strategist", match: 68 },
];

const DUMMY_READINESS: ReadinessItem[] = [
	{ label: "Financial Readiness", value: 64, icon: WalletIcon, hasStatus: true },
	{ label: "Career Readiness", value: 72, icon: HeartPulse, hasStatus: true },
	{ label: "Skill Relevance", value: 78, icon: Zap, hasStatus: false },
	{ label: "Job Mobility", value: 61, icon: Compass, hasStatus: false },
	{ label: "Overall Resilience", value: 69, icon: Activity, hasStatus: true },
];

const DUMMY_WEAKNESSES = [
	"SQL & Data Modeling",
	"Stakeholder Management",
	"AI Workflow Automation",
];

const DUMMY_ACTIONS = [
	{
		title: "Audit pengeluaran esensial & perpanjang runway",
		desc: "Pangkas biaya langganan non-esensial agar dana cadangan bertambah 1–2 bulan.",
		isHigh: true,
	},
	{
		title: "Lengkapi 2 studi kasus proyek di Bukti Karier",
		desc: "Dokumentasikan dampak terukur pekerjaanmu sebagai modal wawancara cepat.",
		isHigh: false,
	},
	{
		title: "Kejar skill jembatan untuk peran alternatif #1",
		desc: "Fokuskan latihan mingguan pada 1–2 skill dengan gap tertinggi.",
		isHigh: false,
	},
];

function formatInsufficientItem(raw: string): string {
	const key = raw.trim().toLowerCase();
	if (INSUFFICIENT_LABELS[key]) return INSUFFICIENT_LABELS[key];
	return raw.replace(/_/g, " ");
}

function clampScore(value: string): number {
	return Math.min(100, Math.max(0, Math.round(parseDecimal(value))));
}

function resolveOutcomeTier(
	statusRaw: string | null | undefined,
	gapMonths: number,
): OutcomeTier {
	const v = (statusRaw ?? "").toLowerCase().trim();
	if (
		v.includes("defisit") ||
		v.includes("deficit") ||
		v.includes("kekurangan") ||
		v.includes("kurang") ||
		v.includes("negative") ||
		v.includes("short") ||
		v.includes("risk")
	) {
		return "deficit";
	}
	if (
		v.includes("tipis") ||
		v.includes("thin") ||
		v.includes("tight") ||
		v.includes("marginal") ||
		v.includes("warning") ||
		v.includes("caution") ||
		v.includes("borderline")
	) {
		return "thin_surplus";
	}
	if (
		v.includes("stabil") ||
		v.includes("stable") ||
		v.includes("safe") ||
		v.includes("aman") ||
		v.includes("healthy") ||
		v.includes("comfortable")
	) {
		return "stable";
	}
	if (gapMonths < 0) return "deficit";
	if (gapMonths < 2) return "thin_surplus";
	return "stable";
}

export default function SimulationResult({
	result,
	onRerun,
}: {
	result: LayoffSimulationResult;
	onRerun?: () => void;
}) {
	const {
		employmentStatus,
		trialGranted,
		trialBannerDismissed,
		grantFirstSimulationTrial,
		dismissTrialBanner,
		isUnlocked,
		requestUnlock,
	} = useCredits();

	const [pivotRoles, setPivotRoles] = useState<
		{ role: string; match: number; prepMonths: number }[]
	>([]);
	const [weaknesses, setWeaknesses] = useState<string[]>([]);
	const [inviteCopied, setInviteCopied] = useState(false);
	const compareSectionRef = useRef<HTMLDivElement>(null);

	const runway = parseDecimal(result.financial_runway_months);
	const target = parseDecimal(result.target_runway_months) || 6;
	const searchMonths = result.search_time_months
		? parseDecimal(result.search_time_months) || 3
		: 3;
	const prepMonths = result.preparation_time_months
		? parseDecimal(result.preparation_time_months)
		: 0;
	const transitionGap =
		result.transition_gap_months != null &&
		result.transition_gap_months !== ""
			? parseDecimal(result.transition_gap_months)
			: runway - (prepMonths + searchMonths);
	const isGapSurplus = transitionGap >= 0;
	const outcomeTier = resolveOutcomeTier(
		result.transition_gap_status,
		transitionGap,
	);

	const overallScore = clampScore(result.overall_resilience_score);
	const overallVariant = getHealthStatus(
		overallScore >= 75
			? "Sehat"
			: overallScore >= 60
				? "Perlu Perhatian"
				: "Kritis",
		overallScore,
	);
	const runwayVariant = getRunwayStatus(runway, target);
	const runwaySt = statusStyles[runwayVariant];
	const diff = runway - target;
	const isSurplus = diff >= 0;
	const maxScale = Math.max(target * 1.4, runway * 1.15, 12);
	const simulatedDate = result.simulated_at
		? formatDateID(result.simulated_at)
		: "";

	const missingDataItems = result.insufficient_data ?? [];
	const hasInsufficientData = missingDataItems.length > 0;
	const needsLegalDisputeNote =
		result.exit_type === "efficiency_due_to_loss" ||
		result.exit_type === "bankruptcy";
	const compareUnlocked = isUnlocked("compare_roles");
	const simulationDetailsUnlocked = compareUnlocked;

	useEffect(() => {
		let active = true;
		const load = async () => {
			const [pivot, exposure] = await Promise.allSettled([
				careerPivotApi.latest(),
				aiExposureApi.latest(),
			]);
			if (!active) return;
			if (pivot.status === "fulfilled") {
				setPivotRoles(
					pivot.value.roles.slice(0, 4).map((r) => ({
						role: r.role_name,
						match: Math.round(parseDecimal(r.match_score)),
						prepMonths: r.preparation_time_months ?? 0,
					})),
				);
			}
			if (exposure.status === "fulfilled") {
				setWeaknesses(exposure.value.skills_to_improve.slice(0, 3));
			}
		};
		void load();
		return () => {
			active = false;
		};
	}, []);

	// Bangun baris perbandingan peran dari data backend (role_transitions atau pivotRoles)
	const comparisonRows: PivotComparisonRow[] = (() => {
		if (result.role_transitions && result.role_transitions.length > 0) {
			return result.role_transitions.map((raw, idx) => {
				const rec = raw as Record<string, unknown>;
				const name = String(
					rec.role_name ?? rec.transition_role_name ?? `Peran Alternatif ${idx + 1}`,
				);
				const matchVal =
					rec.match_score != null
						? Math.round(parseDecimal(String(rec.match_score)))
						: null;
				const prepVal = parseDecimal(
					String(rec.preparation_time_months ?? 0),
				);
				const gapVal =
					rec.transition_gap_months != null
						? parseDecimal(String(rec.transition_gap_months))
						: runway - (prepVal + searchMonths);
				return {
					role: name,
					match: matchVal,
					prepMonths: prepVal,
					gapMonths: gapVal,
				};
			});
		}
		return pivotRoles.map((p) => ({
			role: p.role,
			match: p.match,
			prepMonths: p.prepMonths,
			gapMonths: runway - (p.prepMonths + searchMonths),
		}));
	})();

	const handleCompareRolesAction = () => {
		if (compareUnlocked) {
			compareSectionRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
			return;
		}
		requestUnlock("compare_roles", () => {
			setTimeout(() => {
				compareSectionRef.current?.scrollIntoView({
					behavior: "smooth",
					block: "center",
				});
			}, 120);
		});
	};

	const handleInviteFriend = async () => {
		const shareUrl = window.location.origin;
		const shareText = `Aku baru cek ketahanan karier & finansialku di Jalur B. Coba hitung runway dan hak pesangonmu sesuai PP 35/2021 di ${shareUrl}`;
		try {
			if (navigator.share) {
				await navigator.share({
					title: "Jalur B — Cek Ketahanan Karier & Finansial",
					text: shareText,
					url: shareUrl,
				});
				return;
			}
			await navigator.clipboard.writeText(shareText);
			setInviteCopied(true);
			setTimeout(() => setInviteCopied(false), 2600);
		} catch {
			// dibatalkan user atau clipboard tidak tersedia
		}
	};

	const readiness: ReadinessItem[] = [
		{
			label: "Financial Readiness",
			value: clampScore(result.financial_readiness_score),
			icon: WalletIcon,
			hasStatus: true,
		},
		{
			label: "Career Readiness",
			value: clampScore(result.career_readiness_score),
			icon: HeartPulse,
			hasStatus: true,
		},
		{
			label: "Skill Relevance",
			value: clampScore(result.skill_relevance_score),
			icon: Zap,
			hasStatus: false,
		},
		{
			label: "Job Mobility",
			value: clampScore(result.job_mobility_score),
			icon: Compass,
			hasStatus: false,
		},
		{
			label: "Overall Resilience",
			value: overallScore,
			icon: Activity,
			hasStatus: true,
		},
	];

	const transitionSentence =
		outcomeTier === "deficit"
			? `Estimasi waktu transisi (${formatMonths(prepMonths + searchMonths, "bulan")}) lebih panjang dari runway saat ini — prioritaskan peran dengan masa persiapan lebih singkat atau perkuat dana cadangan.`
			: outcomeTier === "thin_surplus"
				? `Kamu masih punya cadangan tipis sebesar ${formatMonths(Math.abs(transitionGap), "bulan")} setelah menutup masa persiapan dan cari kerja. Bandingkan peran lain untuk memperlebar ruang aman.`
				: `Dana cadanganmu melampaui kebutuhan masa persiapan dan pencarian kerja dengan sisa aman ${formatMonths(Math.abs(transitionGap), "bulan")}.`;

	return (
		<div className="space-y-6">
			{/* P0 #4: Status Sudah Berhenti -> Tenggat Klaim JKP Tampil Paling Atas (GRATIS) */}
			{employmentStatus === "stopped" && (
				<Card
					padding="md"
					className="border-2 border-amber-300 bg-amber-50/75">
					<div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
						<div className="flex items-start gap-3.5">
							<IconTile icon={AlarmClock} tone="caution" size="md" />
							<div className="space-y-2">
								<div className="flex flex-wrap items-center gap-2">
									<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold">
										<CalendarClock size={12} />
										Prioritas Utama · Status Sudah Berhenti
									</span>
									<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-emerald-200 text-emerald-800 text-xs font-semibold">
										<ShieldCheck size={12} />
										Gratis · Hak Normatif
									</span>
								</div>

								<h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
									Segera Ajukan Klaim JKP Maksimal 3 Bulan Sejak Tanggal PHK
								</h3>

								<p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl">
									Berdasarkan <strong>PP 6/2025</strong>, peserta BPJS
									Ketenagakerjaan yang memenuhi syarat berhak atas manfaat uang
									tunai <strong>60% upah hingga 6 bulan</strong> (batas atas upah
									Rp5 juta), akses pasar kerja, dan pelatihan kerja. Hak klaim
									gugur bila melewati tenggat 3 bulan.
								</p>

								<div className="flex flex-wrap gap-2 pt-1 text-xs">
									<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-slate-800 font-medium">
										<FileCheck2 size={13} className="text-indigo-600" />
										Siapkan bukti PHK / perjanjian bersama
									</span>
									<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-slate-800 font-medium">
										<ShieldCheck size={13} className="text-emerald-600" />
										Lapor &amp; klaim lewat portal SIAPkerja Kemnaker
									</span>
								</div>
							</div>
						</div>
					</div>
				</Card>
			)}

			{/* P0 #5: Banner insufficient_data dengan tombol langsung ke halaman Finansial */}
			{hasInsufficientData && (
				<Card
					padding="md"
					className="border-amber-200 bg-amber-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div className="flex items-start gap-3">
						<IconTile icon={AlertCircle} tone="caution" size="sm" />
						<div>
							<h3 className="text-sm font-bold text-slate-900">
								Data finansial belum lengkap untuk proyeksi penuh
							</h3>
							<p className="text-xs text-slate-700 mt-1 leading-relaxed">
								Beberapa parameter masih kosong:{" "}
								<strong className="text-slate-900">
									{missingDataItems.map(formatInsufficientItem).join(", ")}
								</strong>
								. Lengkapi agar hitungan runway dan Transition Gap semakin akurat.
							</p>
						</div>
					</div>
					<Link to="/dashboard/finansial" className="shrink-0">
						<PrimaryButton
							size="sm"
							icon={<WalletIcon size={14} />}>
							Lengkapi di Finansial
						</PrimaryButton>
					</Link>
				</Card>
			)}

			{/* P1 #9: Banner Trial 6 Credit (muncul sekali setelah simulasi pertama; klaim manual agar default saldo tetap 0) */}
			{!trialBannerDismissed && (
				<Card
					variant="hero"
					padding="md"
					className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div className="flex items-start gap-3.5">
						<IconTile icon={Gift} tone="indigo" size="md" />
						<div>
							<div className="flex flex-wrap items-center gap-2">
								<span className="text-sm font-bold text-slate-900">
									6 credit gratis, berlaku 14 hari.
								</span>
								<span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-semibold">
									{trialGranted ? "Sudah Diklaim" : "Bonus Simulasi Pertama"}
								</span>
							</div>
							<p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
								{trialGranted
									? "6 credit trial sudah masuk ke saldo B-Credits kamu. Pakai untuk membuka semua kartu detail simulasi."
									: "Kamu berhak atas bonus 6 credit trial setelah simulasi pertama, atau langsung beli paket sesuai kelompok gajimu di halaman Harga."}
							</p>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-center">
						{!trialGranted && (
							<PrimaryButton
								size="sm"
								icon={<Gift size={14} />}
								onClick={() => grantFirstSimulationTrial()}>
								Klaim 6 Credit
							</PrimaryButton>
						)}
						<Link to="/harga">
							<SecondaryButton size="sm" icon={<Coins size={14} />}>
								Beli Paket
							</SecondaryButton>
						</Link>
						<button
							type="button"
							onClick={dismissTrialBanner}
							aria-label="Tutup banner trial"
							className="min-w-[36px] min-h-[36px] rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white transition inline-flex items-center justify-center cursor-pointer">
							<X size={16} />
						</button>
					</div>
				</Card>
			)}

			{/* P0 #2 & P0 #3: Kartu Transition Gap Besar + 3 Gaya Hasil (Defisit / Surplus tipis / Stabil) */}
			<Card
				padding="lg"
				className={`border-l-4 ${
					outcomeTier === "stable"
						? "border-l-emerald-600 bg-gradient-to-br from-emerald-50/45 via-white to-white"
						: outcomeTier === "thin_surplus"
							? "border-l-amber-500 bg-gradient-to-br from-amber-50/40 via-white to-white"
							: "border-l-rose-600 bg-gradient-to-br from-rose-50/40 via-white to-white"
				}`}>
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
					{/* Kiri: Angka Transition Gap Besar + Label Cadangan/Kekurangan + Regulasi */}
					<div className="lg:col-span-7 space-y-4">
						<div className="flex flex-wrap items-center gap-2">
							<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
								<Scale size={14} className="text-indigo-600" />
								Transition Gap
								{result.transition_role_name
									? ` · ${result.transition_role_name}`
									: ""}
							</span>
							<StatusBadge
								variant={isGapSurplus ? "healthy" : "risk"}
								label={isGapSurplus ? "Cadangan" : "Kekurangan"}
							/>
							<span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
								{outcomeTier === "deficit"
									? "Defisit"
									: outcomeTier === "thin_surplus"
										? "Surplus tipis"
										: "Stabil"}
							</span>
						</div>

						<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
							<span
								className={`num-display text-4xl sm:text-5xl lg:text-[54px] ${
									isGapSurplus ? "text-emerald-700" : "text-rose-700"
								}`}>
								{transitionGap >= 0 ? "+" : "−"}
								<CountUp
									value={Math.abs(transitionGap)}
									decimals={1}
									format={(n) => formatDecimal1(n)}
								/>
							</span>
							<span className="text-lg sm:text-xl font-semibold text-slate-600">
								bulan {isGapSurplus ? "cadangan" : "kekurangan"}
							</span>
						</div>

						<p className="text-sm text-slate-700 leading-relaxed max-w-2xl">
							{transitionSentence}
						</p>

						{/* Rumus transparan dari angka backend */}
						<div className="flex flex-wrap items-center gap-2 text-xs">
							<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium tabular">
								<WalletIcon size={12} className="text-indigo-600" />
								Runway: <strong>{formatMonths(runway)}</strong>
							</span>
							<span className="text-slate-400 font-bold">−</span>
							<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium tabular">
								<Compass size={12} className="text-indigo-600" />
								Persiapan: <strong>{formatMonths(prepMonths)}</strong>
							</span>
							<span className="text-slate-400 font-bold">−</span>
							<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium tabular">
								<CalendarClock size={12} className="text-indigo-600" />
								Cari kerja: <strong>{formatMonths(searchMonths)}</strong>
							</span>
						</div>

						<p className="text-xs font-medium text-slate-500 inline-flex items-center gap-1.5 pt-1">
							<Scale size={13} className="text-slate-400 shrink-0" />
							<span>
								Dasar: PP 35/2021 &amp; PP 6/2025
								{result.regulation_version
									? ` (${result.regulation_version})`
									: ""}
								.
							</span>
						</p>
					</div>

					{/* Kanan: Tiga Gaya Hasil (Defisit / Surplus tipis / Stabil) */}
					<div className="lg:col-span-5">
						{outcomeTier === "deficit" && (
							<div className="rounded-2xl border border-rose-200/90 bg-white p-5 space-y-3.5 shadow-2xs">
								<div className="flex items-start gap-3">
									<IconTile icon={ShieldAlert} tone="danger" size="sm" />
									<div>
										<span className="text-xs font-bold text-rose-700">
											Strategi Menutup Defisit
										</span>
										<h4 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
											Cari peran dengan persiapan lebih singkat
										</h4>
									</div>
								</div>
								<p className="text-xs text-slate-600 leading-relaxed">
									Buka perbandingan lintas peran dan peta skill gap untuk
									menemukan jalur transisi yang cocok dengan sisa napas
									finansialmu saat ini.
								</p>
								<div className="space-y-2 pt-1">
									<PrimaryButton
										fullWidth
										size="sm"
										icon={
											compareUnlocked ? (
												<Compass size={14} />
											) : (
												<Lock size={14} />
											)
										}
										onClick={handleCompareRolesAction}>
										{compareUnlocked
											? "Lihat Perbandingan Peran"
											: "Bandingkan Peran Lain · 3 credit"}
									</PrimaryButton>
									<Link to="/harga" className="block">
										<SecondaryButton
											fullWidth
											size="sm"
											icon={<Coins size={14} />}>
											Lihat Semua Fitur B-Credits
										</SecondaryButton>
									</Link>
								</div>
							</div>
						)}

						{outcomeTier === "thin_surplus" && (
							<div className="rounded-2xl border border-amber-200/90 bg-white p-5 space-y-3.5 shadow-2xs">
								<div className="flex items-start gap-3">
									<IconTile icon={Compass} tone="caution" size="sm" />
									<div>
										<span className="text-xs font-bold text-amber-800">
											Ruang Cadangan Masih Tipis
										</span>
										<h4 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
											Perbesar peluang dengan opsi peran lain
										</h4>
									</div>
								</div>
								<p className="text-xs text-slate-600 leading-relaxed">
									Bandingkan beberapa peran alternatif untuk melihat jalur mana
									yang memberikan cadangan waktu paling lega bila transisi
									memakan waktu lebih lama.
								</p>
								<div className="pt-1">
									<PrimaryButton
										fullWidth
										size="sm"
										icon={
											compareUnlocked ? (
												<Compass size={14} />
											) : (
												<Lock size={14} />
											)
										}
										onClick={handleCompareRolesAction}>
										{compareUnlocked
											? "Bandingkan peran lain"
											: "Bandingkan peran lain · 3 credit"}
									</PrimaryButton>
								</div>
							</div>
						)}

						{outcomeTier === "stable" && (
							<div className="rounded-2xl border border-emerald-200/90 bg-white p-5 space-y-3.5 shadow-2xs">
								<div className="flex items-start gap-3">
									<IconTile icon={ShieldCheck} tone="safe" size="sm" />
									<div>
										<span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
											<CheckCircle2 size={12} />
											Kamu aman
										</span>
										<h4 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
											Posisi transisimu berada di zona stabil
										</h4>
									</div>
								</div>
								<p className="text-xs text-slate-600 leading-relaxed">
									Dana cadanganmu cukup nyaman untuk menutup masa transisi. Coba
									uji skenario lain (misal tanpa pesangon) atau bagikan Jalur B
									ke rekan kerjamu.
								</p>
								<div className="flex flex-col sm:flex-row gap-2 pt-1">
									{onRerun && (
										<PrimaryButton
											fullWidth
											size="sm"
											icon={<RotateCcw size={14} />}
											onClick={onRerun}>
											Simulasi ulang
										</PrimaryButton>
									)}
									<SecondaryButton
										fullWidth
										size="sm"
										icon={
											inviteCopied ? <Check size={14} /> : <Share2 size={14} />
										}
										onClick={() => void handleInviteFriend()}>
										{inviteCopied ? "Tautan tersalin!" : "Undang teman"}
									</SecondaryButton>
								</div>
							</div>
						)}
					</div>
				</div>
			</Card>

			{/* P2 #14: Catatan hukum Disnaker/LBH untuk PHK efisiensi karena rugi dan pailit */}
			{needsLegalDisputeNote && (
				<Card
					padding="md"
					className="border-amber-200/90 bg-amber-50/50 flex items-start gap-3.5">
					<IconTile icon={Scale} tone="caution" size="sm" />
					<div className="text-xs sm:text-sm">
						<p className="font-bold text-slate-900">
							Catatan Hukum · Hak bisa disengketakan, konsultasi Disnaker/LBH.
						</p>
						<p className="text-xs text-slate-600 mt-1 leading-relaxed">
							Skenario{" "}
							<strong>
								{exitTypeLabels[result.exit_type ?? ""] ?? result.exit_type}
							</strong>{" "}
							sering menimbulkan perbedaan tafsir perhitungan hak normatif.
							Pastikan ada bukti laporan keuangan/putusan pailit resmi, dan
							jangan ragu berkonsultasi ke Disnaker setempat atau LBH sebelum
							menandatangani kesepakatan.
						</p>
					</div>
				</Card>
			)}

			{/* Ringkasan Proyeksi Simulasi */}
			<Card
				variant="hero"
				padding="lg"
				className="flex flex-col md:flex-row md:items-center justify-between gap-5">
				<div className="flex items-start gap-4">
					<IconTile icon={Activity} tone="indigo" size="md" />
					<div>
						<div className="flex flex-wrap items-center gap-2 mb-1.5">
							<span className="text-xs font-semibold text-indigo-700">
								Ringkasan Proyeksi Simulasi
							</span>
							<StatusBadge
								variant={overallVariant}
								label={`Resilience ${overallScore}/100`}
								size="sm"
							/>
						</div>
						<p className="text-sm sm:text-[15px] text-slate-800 leading-relaxed max-w-3xl">
							{result.summary ||
								"Simulasi selesai dihitung berdasarkan kondisi karier, tabungan likuid, dan ketentuan kerjamu."}
						</p>
						<p className="text-xs font-medium text-slate-500 mt-2">
							Skenario:{" "}
							<strong className="text-slate-900">
								{result.exit_type
									? (exitTypeLabels[result.exit_type] ?? result.exit_type)
									: (scenarioLabels[result.scenario] ?? result.scenario)}
							</strong>
							{result.search_time_months
								? ` · Estimasi cari kerja: ${Math.round(parseDecimal(result.search_time_months))} bln`
								: ""}
							{result.regulation_version
								? ` · Regulasi: ${result.regulation_version}`
								: ""}
							{simulatedDate ? ` · ${simulatedDate}` : ""}
						</p>
					</div>
				</div>

				{onRerun && (
					<div className="shrink-0">
						<SecondaryButton
							icon={<RotateCcw size={15} />}
							onClick={onRerun}>
							Jalankan Ulang
						</SecondaryButton>
					</div>
				)}
			</Card>

			{/* ================================================================
			    BAGIAN GRATIS: Proyeksi Financial Runway + Target #1 + Bukti Karier
			   ================================================================ */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
				<div className="lg:col-span-8">
					{/* Proyeksi Financial Runway (GRATIS SELAMANYA) */}
					<Card
						padding="lg"
						className={`border-l-4 ${
							runwayVariant === "healthy"
								? "border-l-emerald-500"
								: runwayVariant === "warning"
									? "border-l-amber-500"
									: "border-l-rose-500"
						}`}>
						<div className="flex flex-wrap items-center justify-between gap-2 mb-3">
							<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
								<WalletIcon size={14} className="text-indigo-600" />
								Proyeksi Financial Runway Pasca-PHK
							</span>
							<StatusBadge
								variant={runwayVariant}
								label={
									runwayVariant === "healthy"
										? "Aman · Di Atas Target"
										: runwayVariant === "warning"
											? "Mendekati Target"
											: "Perlu Diperkuat"
								}
							/>
						</div>

						<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
							<div>
								<h3 className="text-lg sm:text-xl font-bold text-slate-900 max-w-lg leading-snug">
									Kamu masih punya waktu sekitar{" "}
									<span className={runwaySt.text}>
										{formatMonths(runway, "bulan")}
									</span>{" "}
									napas finansial untuk bertransisi dengan tenang.
								</h3>
								<p className="text-xs sm:text-sm text-slate-600 mt-1">
									{isSurplus
										? `Cadangan +${formatMonths(Math.abs(diff), "bulan")} di atas target aman ${formatMonths(target, "bulan")}.`
										: `Kekurangan ${formatMonths(Math.abs(diff), "bulan")} lagi untuk menyentuh target aman ${formatMonths(target, "bulan")}.`}
								</p>
							</div>

							<div className="text-left sm:text-right shrink-0">
								<span className={`num-display text-5xl ${runwaySt.text}`}>
									<CountUp
										value={runway}
										decimals={1}
										format={(n) => formatDecimal1(n)}
									/>
								</span>
								<p className="text-xs font-semibold text-slate-500 mt-0.5">
									bulan runway
								</p>
							</div>
						</div>

						<div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
							<span>0 bln</span>
							<span className="inline-flex items-center gap-1 text-slate-900">
								<Target size={12} />
								Target: {formatMonths(target)}
							</span>
							<span>{formatMonths(maxScale)}</span>
						</div>
						<MeterBar
							value={runway}
							max={maxScale}
							target={target}
							status={runwayVariant}
							height="lg"
							showTicks
						/>
					</Card>
				</div>

				<div className="lg:col-span-4 space-y-5">
					{result.transition_role_name && (
						<Card padding="md">
							<div className="flex items-center gap-2.5 mb-2">
								<IconTile icon={Compass} tone="indigo" size="sm" />
								<div>
									<span className="text-xs font-semibold text-indigo-700">
										Target Transisi Karier (#1 Gratis)
									</span>
									<p className="text-base font-bold text-slate-900">
										{result.transition_role_name}
									</p>
								</div>
							</div>
							<p className="text-xs text-slate-600 mt-1">
								Transition Gap:{" "}
								<strong
									className={
										isGapSurplus ? "text-emerald-700" : "text-rose-700"
									}>
									{transitionGap >= 0 ? "+" : "−"}
									{formatMonths(Math.abs(transitionGap), "bulan")} (
									{isGapSurplus ? "Cadangan" : "Kekurangan"})
								</strong>
							</p>
						</Card>
					)}

					<Card padding="md">
						<div className="flex items-center gap-3 mb-2">
							<IconTile icon={FolderCheck} tone="indigo" size="sm" />
							<div>
								<h4 className="text-sm font-bold text-slate-900">
									Portofolio Bukti Karier
								</h4>
								<p className="text-xs text-slate-600">
									Kamu memiliki{" "}
									<strong className="text-indigo-700">
										{result.evidence_count} bukti tersimpan
									</strong>
								</p>
							</div>
						</div>
						<Link
							to="/dashboard/bukti-karier"
							className="mt-2 inline-flex items-center justify-between w-full min-h-[40px] px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-xs font-semibold text-indigo-700 transition">
							<span>Tambah bukti pencapaian</span>
							<ArrowRight size={13} />
						</Link>
					</Card>
				</div>
			</div>

			{/* ================================================================
			    BAGIAN ANALISIS LANJUTAN (Gaya Strava: "Unlock your full potential." +
			    Nuansa shadow/blur gelap + Data Dummy Blur Progresif + CTA "Start Free Trial")
			   ================================================================ */}
			<section
				aria-label="Analisis Lanjutan B-Credits"
				className={`relative isolate overflow-hidden rounded-3xl transition ${
					simulationDetailsUnlocked
						? "space-y-5 pt-2"
						: "border border-slate-200/90 bg-gradient-to-br from-slate-100/80 via-white to-slate-50/60 p-5 sm:p-7 space-y-5"
				}`}>
				{/* Aura gelap halus di kiri atas */}
				{!simulationDetailsUnlocked && (
					<div
						aria-hidden
						className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-slate-900/[0.07] blur-3xl"
					/>
				)}

				<div className="relative flex flex-col md:flex-row md:items-end justify-between gap-4">
					<div className="space-y-2.5 max-w-2xl">
						<span
							className={`inline-flex items-center justify-center w-10 h-10 rounded-full border shadow-xs ${
								simulationDetailsUnlocked
									? "bg-emerald-50 border-emerald-200 text-emerald-700"
									: "bg-slate-900 border-slate-800 text-white"
							}`}>
							{simulationDetailsUnlocked ? (
								<CheckCircle2 size={18} strokeWidth={2.1} />
							) : (
								<Lock size={17} strokeWidth={2.1} />
							)}
						</span>

						<div>
							<h3 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight leading-tight">
								{simulationDetailsUnlocked
									? "Full simulation insights unlocked."
									: "Unlock your full potential."}
							</h3>
							<p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
								{simulationDetailsUnlocked
									? "Seluruh kartu perbandingan peran, indikator kesiapan, opsi pivot, skill prioritas, garis waktu, dan langkah aksi sudah menampilkan data aslimu."
									: "Kartu di bawah masih berupa contoh pratinjau. Buka dengan 3 credit untuk langsung melihat seluruh data risiko, peta pivot, dan titik kritis dana aslimu sebelum terlambat."}
							</p>
						</div>
					</div>

					{!simulationDetailsUnlocked && (
						<div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-end">
							<PrimaryButton
								size="sm"
								icon={<Lock size={14} />}
								onClick={handleCompareRolesAction}>
								Buka Semua · 3 credit
							</PrimaryButton>
							<Link to="/harga">
								<SecondaryButton size="sm" icon={<Coins size={14} />}>
									Beli Credit
								</SecondaryButton>
							</Link>
						</div>
					)}
				</div>

				{/* Baris 1: Perbandingan Peran (8 col) + Opsi Pivot Terdekat (4 col) */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
					<div ref={compareSectionRef} className="lg:col-span-8">
						<LockedPreviewCard
							featureId="compare_roles"
							costLabel="Buka Semua · 3 credit"
							title="Perbandingan Transition Gap Lintas Peran"
							subtitle="Bandingkan estimasi persiapan dan cadangan waktu antar peran alternatif"
							icon={Compass}
							previewMaxHeight="max-h-[210px]"
							lockedHint="Contoh pratinjau · Beli credit untuk melihat data aslimu"
							lockedPreview={
								<div className="overflow-x-auto -mx-1 px-1">
									<table className="w-full text-left border-collapse text-xs sm:text-sm">
										<thead>
											<tr className="border-b border-slate-200 text-slate-500 text-xs">
												<th className="py-2 pr-3 font-semibold">Peran Tujuan</th>
												<th className="py-2 px-3 font-semibold">Kecocokan</th>
												<th className="py-2 px-3 font-semibold">Persiapan</th>
												<th className="py-2 pl-3 font-semibold text-right">
													Transition Gap
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-slate-100">
											{DUMMY_COMPARISON_ROWS.map((row, idx) => {
												const rowSurplus = row.gapMonths >= 0;
												return (
													<tr key={`dummy-cmp-${idx}`}>
														<td className="py-3 pr-3 font-semibold text-slate-900">
															<div className="flex items-center gap-2">
																<span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-bold shrink-0">
																	{idx + 1}
																</span>
																<span>{row.role}</span>
															</div>
														</td>
														<td className="py-3 px-3 text-slate-700 tabular">
															{row.match}%
														</td>
														<td className="py-3 px-3 text-slate-700 tabular">
															{formatMonths(row.prepMonths)}
														</td>
														<td className="py-3 pl-3 text-right">
															<span
																className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border tabular ${
																	rowSurplus
																		? "bg-emerald-50 text-emerald-800 border-emerald-200"
																		: "bg-rose-50 text-rose-800 border-rose-200"
																}`}>
																{rowSurplus ? (
																	<ShieldCheck size={11} />
																) : (
																	<AlertTriangle size={11} />
																)}
																{row.gapMonths >= 0 ? "+" : "−"}
																{formatDecimal1(Math.abs(row.gapMonths))} bln (
																{rowSurplus ? "Cadangan" : "Kekurangan"})
															</span>
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							}>
							{comparisonRows.length > 0 ? (
								<div className="overflow-x-auto -mx-1 px-1">
									<table className="w-full text-left border-collapse text-xs sm:text-sm">
										<thead>
											<tr className="border-b border-slate-200 text-slate-500 text-xs">
												<th className="py-2 pr-3 font-semibold">Peran Tujuan</th>
												<th className="py-2 px-3 font-semibold">Kecocokan</th>
												<th className="py-2 px-3 font-semibold">Persiapan</th>
												<th className="py-2 pl-3 font-semibold text-right">
													Transition Gap
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-slate-100">
											{comparisonRows.map((row, idx) => {
												const rowSurplus = row.gapMonths >= 0;
												return (
													<tr key={`${row.role}-${idx}`}>
														<td className="py-3 pr-3 font-semibold text-slate-900">
															<div className="flex items-center gap-2">
																<span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-bold shrink-0">
																	{idx + 1}
																</span>
																<span>{row.role}</span>
															</div>
														</td>
														<td className="py-3 px-3 text-slate-700 tabular">
															{row.match != null ? `${row.match}%` : "—"}
														</td>
														<td className="py-3 px-3 text-slate-700 tabular">
															{formatMonths(row.prepMonths)}
														</td>
														<td className="py-3 pl-3 text-right">
															<span
																className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border tabular ${
																	rowSurplus
																		? "bg-emerald-50 text-emerald-800 border-emerald-200"
																		: "bg-rose-50 text-rose-800 border-rose-200"
																}`}>
																{rowSurplus ? (
																	<ShieldCheck size={11} />
																) : (
																	<AlertTriangle size={11} />
																)}
																{row.gapMonths >= 0 ? "+" : "−"}
																{formatDecimal1(Math.abs(row.gapMonths))} bln (
																{rowSurplus ? "Cadangan" : "Kekurangan"})
															</span>
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							) : (
								<p className="text-xs text-slate-500">
									Lengkapi penilaian karier di menu Jalur Karier untuk melihat
									daftar peran alternatif yang bisa dibandingkan.
								</p>
							)}
						</LockedPreviewCard>
					</div>

					<div className="lg:col-span-4">
						<LockedPreviewCard
							featureId="compare_roles"
							costLabel="3 credit"
							title="Opsi Pivot Terdekat"
							subtitle="Peran dengan kecocokan tertinggi"
							icon={Compass}
							previewMaxHeight="max-h-[210px]"
							lockedHint="Contoh pratinjau · Buka peran aslimu"
							lockedPreview={
								<div className="space-y-2.5">
									{DUMMY_PIVOT_ROLES.map((option) => (
										<div
											key={`dummy-pivot-${option.role}`}
											className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-between gap-2">
											<span className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
												{option.role}
											</span>
											<span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full shrink-0 tabular">
												{option.match}% cocok
											</span>
										</div>
									))}
								</div>
							}>
							<div className="space-y-2.5">
								{pivotRoles.length > 0 ? (
									pivotRoles.slice(0, 4).map((option) => (
										<div
											key={option.role}
											className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-between gap-2">
											<span className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
												{option.role}
											</span>
											<span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full shrink-0 tabular">
												{option.match}% cocok
											</span>
										</div>
									))
								) : (
									<p className="text-xs text-slate-500">
										Lengkapi penilaian karier untuk melihat rekomendasi pivot.
									</p>
								)}
							</div>
						</LockedPreviewCard>
					</div>
				</div>

				{/* Baris 2: 5 Indikator Kesiapan Transisi (8 col) + Skill yang Perlu Diperkuat (4 col) */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
					<div className="lg:col-span-8">
						<LockedPreviewCard
							featureId="compare_roles"
							costLabel="3 credit"
							title="5 Indikator Kesiapan Transisi"
							subtitle="Skor 0–100 pada tiap aspek ketahanan finansial dan karier"
							icon={Activity}
							previewMaxHeight="max-h-[206px]"
							lockedHint="Contoh pratinjau · Beli credit untuk skor kesiapan aslimu"
							lockedPreview={
								<div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3.5">
									{DUMMY_READINESS.map((item) => {
										const st = item.hasStatus
											? getScoreStatus(item.value)
											: undefined;
										return (
											<div
												key={`dummy-readiness-${item.label}`}
												className="rounded-xl border border-slate-200 bg-white p-3.5 flex flex-col items-center text-center">
												<ScoreRing
													value={item.value}
													max={100}
													size={82}
													stroke={8}
													status={st}
													suffix="/100"
													label={item.label}
												/>
												<p className="text-xs font-semibold text-slate-900 mt-2.5 leading-snug">
													{item.label}
												</p>
											</div>
										);
									})}
								</div>
							}>
							<Stagger className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3.5">
								{readiness.map((item) => {
									const st = item.hasStatus
										? getScoreStatus(item.value)
										: undefined;
									return (
										<StaggerItem
											key={item.label}
											className="rounded-xl border border-slate-200 bg-white p-3.5 flex flex-col items-center text-center">
											<ScoreRing
												value={item.value}
												max={100}
												size={82}
												stroke={8}
												status={st}
												suffix="/100"
												label={item.label}
											/>
											<p className="text-xs font-semibold text-slate-900 mt-2.5 leading-snug">
												{item.label}
											</p>
										</StaggerItem>
									);
								})}
							</Stagger>
						</LockedPreviewCard>
					</div>

					<div className="lg:col-span-4">
						<LockedPreviewCard
							featureId="compare_roles"
							costLabel="3 credit"
							title="Skill yang Perlu Diperkuat"
							subtitle="Prioritas latihan menghadapi paparan AI"
							icon={TrendingDown}
							previewMaxHeight="max-h-[206px]"
							lockedHint="Contoh pratinjau · Buka daftar skill aslimu"
							lockedPreview={
								<div className="space-y-2.5">
									{DUMMY_WEAKNESSES.map((skill) => (
										<div
											key={`dummy-skill-${skill}`}
											className="flex items-center justify-between gap-2 rounded-xl bg-amber-50/70 border border-amber-200 px-3 py-2.5">
											<div className="flex items-center gap-2 min-w-0">
												<TrendingDown
													size={14}
													className="text-amber-700 shrink-0"
												/>
												<span className="text-xs font-semibold text-slate-900 truncate">
													{skill}
												</span>
											</div>
											<span className="text-xs font-semibold text-amber-800 shrink-0">
												Prioritas
											</span>
										</div>
									))}
								</div>
							}>
							<div className="space-y-2.5">
								{weaknesses.length > 0 ? (
									weaknesses.map((skill) => (
										<div
											key={skill}
											className="flex items-center justify-between gap-2 rounded-xl bg-amber-50/70 border border-amber-200 px-3 py-2.5">
											<div className="flex items-center gap-2 min-w-0">
												<TrendingDown
													size={14}
													className="text-amber-700 shrink-0"
												/>
												<span className="text-xs font-semibold text-slate-900 truncate">
													{skill}
												</span>
											</div>
											<span className="text-xs font-semibold text-amber-800 shrink-0">
												Prioritas
											</span>
										</div>
									))
								) : (
									<p className="text-xs text-slate-500">
										Belum ada rekomendasi skill spesifik.
									</p>
								)}
							</div>
						</LockedPreviewCard>
					</div>
				</div>

				{/* Baris 3: Garis Waktu Ketahanan (Full Width) */}
				<LockedPreviewCard
					featureId="compare_roles"
					costLabel="3 credit"
					title="Garis Waktu Ketahanan (Hari 0 → Target)"
					subtitle="Visualisasi zona aman, evaluasi, dan batas kritis dana cadanganmu"
					icon={CalendarRange}
					previewMaxHeight="max-h-[212px]"
					lockedHint="Contoh pratinjau · Beli credit untuk garis waktu dana aslimu"
					lockedPreview={
						<ResultTimeline runwayMonths={4.5} targetMonths={6} embedded />
					}>
					<ResultTimeline
						runwayMonths={runway}
						targetMonths={target}
						embedded
					/>
				</LockedPreviewCard>

				{/* Baris 4: Rencana Langkah Aksi Prioritas (Full Width) */}
				{result.action_items && result.action_items.length > 0 && (
					<LockedPreviewCard
						featureId="compare_roles"
						costLabel="3 credit"
						title="Rencana Langkah Aksi Prioritas"
						subtitle="Langkah konkret yang bisa kamu cicil mulai minggu ini"
						icon={CheckSquare}
						previewMaxHeight="max-h-[208px]"
						lockedHint="Contoh pratinjau · Beli credit untuk rencana aksi personalmu"
						lockedPreview={
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{DUMMY_ACTIONS.map((item, idx) => (
									<div
										key={`dummy-action-${idx}`}
										className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col justify-between gap-3">
										<div>
											<div className="flex items-center justify-between gap-2 mb-2.5">
												<span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold tabular">
													{String(idx + 1).padStart(2, "0")}
												</span>
												<span
													className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
														item.isHigh
															? "bg-amber-50 text-amber-800 border-amber-200"
															: "bg-slate-50 text-slate-700 border-slate-200"
													}`}>
													{item.isHigh ? "Prioritas Utama" : `Tahap ${idx + 1}`}
												</span>
											</div>
											<p className="text-sm font-bold text-slate-900 leading-snug">
												{item.title}
											</p>
											<p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
												{item.desc}
											</p>
										</div>
									</div>
								))}
							</div>
						}>
						<Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{result.action_items.map((item, idx) => {
								const rec = item as Record<string, unknown>;
								const title = (rec.title ||
									rec.action ||
									rec.name ||
									`Langkah Prioritas ${idx + 1}`) as string;
								const desc = (rec.description ||
									rec.detail ||
									rec.summary ||
									"") as string;
								const rawPriority = String(rec.priority ?? "").toLowerCase();
								const isHigh =
									idx === 0 ||
									rawPriority.includes("high") ||
									rawPriority.includes("tinggi");

								return (
									<StaggerItem
										key={idx}
										className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col justify-between gap-3">
										<div>
											<div className="flex items-center justify-between gap-2 mb-2.5">
												<span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold tabular">
													{String(idx + 1).padStart(2, "0")}
												</span>
												<span
													className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
														isHigh
															? "bg-amber-50 text-amber-800 border-amber-200"
															: "bg-slate-50 text-slate-700 border-slate-200"
													}`}>
													{isHigh ? "Prioritas Utama" : `Tahap ${idx + 1}`}
												</span>
											</div>
											<p className="text-sm font-bold text-slate-900 leading-snug">
												{title}
											</p>
											{desc && (
												<p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
													{desc}
												</p>
											)}
										</div>
									</StaggerItem>
								);
							})}
						</Stagger>
					</LockedPreviewCard>
				)}

				{/* Bottom Bait CTA ala Strava ("Start Free Trial") saat masih locked */}
				{!simulationDetailsUnlocked && (
					<div className="pt-2 space-y-2.5">
						<Link
							to="/harga"
							state={{ fromFeature: "compare_roles" }}
							className="press w-full min-h-[52px] rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base font-bold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition">
							<span>Start Free Trial</span>
							<ArrowRight size={17} strokeWidth={2.2} />
						</Link>
						<p className="text-center text-xs text-slate-500">
							Dapatkan <strong>6 credit gratis (14 hari)</strong> atau pilih paket
							B-Credits sesuai kelompok gajimu — tanpa iklan &amp; tanpa langganan.
						</p>
					</div>
				)}
			</section>

			<Card
				padding="lg"
				className="text-center bg-indigo-950 border-indigo-900 text-white">
				<h3 className="text-lg sm:text-xl font-bold mb-1.5">
					PHK mungkin tidak selalu bisa kamu prediksi.
				</h3>
				<p className="text-sm text-indigo-100/85 max-w-xl mx-auto leading-relaxed">
					Namun dengan mengetahui angka runway dan Transition Gap-mu hari ini,
					kamu memegang kendali penuh atas apa yang terjadi setelahnya.
				</p>
				{onRerun && (
					<div className="mt-5 flex justify-center">
						<PrimaryButton
							icon={<RotateCcw size={14} />}
							onClick={onRerun}>
							Uji Skenario Lain
						</PrimaryButton>
					</div>
				)}
			</Card>
		</div>
	);
}
