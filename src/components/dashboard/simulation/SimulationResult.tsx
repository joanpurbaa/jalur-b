import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
	Activity,
	ArrowRight,
	CheckSquare,
	Compass,
	FolderCheck,
	HeartPulse,
	RotateCcw,
	Target,
	TrendingDown,
	Wallet as WalletIcon,
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
import {
	PrimaryButton,
	SecondaryButton,
} from "../../ui/PrimaryButton";
import { CountUp, Stagger, StaggerItem } from "../../ui/Motion";
import ResultTimeline from "./ResultTimeline";
import { careerPivotApi } from "../../../services/careerPivot";
import { aiExposureApi } from "../../../services/aiExposure";
import { parseDecimal } from "../../../lib/parseNumeric";
import type { LayoffSimulationResult } from "../../../types/layoffSimulation";

interface ReadinessItem {
	label: string;
	value: number;
	icon: LucideIcon;
	hasStatus: boolean;
}

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

function clampScore(value: string): number {
	return Math.min(100, Math.max(0, Math.round(parseDecimal(value))));
}

export default function SimulationResult({
	result,
	onRerun,
}: {
	result: LayoffSimulationResult;
	onRerun?: () => void;
}) {
	const [pivotRoles, setPivotRoles] = useState<
		{ role: string; match: number }[]
	>([]);
	const [weaknesses, setWeaknesses] = useState<string[]>([]);

	const runway = parseDecimal(result.financial_runway_months);
	const target = parseDecimal(result.target_runway_months) || 6;
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
					pivot.value.roles.slice(0, 3).map((r) => ({
						role: r.role_name,
						match: Math.round(parseDecimal(r.match_score)),
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

	return (
		<div className="space-y-6">
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

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
				<div className="lg:col-span-8 space-y-6">
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
							<span className="text-xs font-semibold text-slate-600">
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
										? `Surplus +${formatMonths(Math.abs(diff), "bulan")} di atas target aman ${formatMonths(target, "bulan")}.`
										: `Masih butuh sekitar ${formatMonths(Math.abs(diff), "bulan")} lagi untuk menyentuh target aman ${formatMonths(target, "bulan")}.`}
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

					<Card padding="lg">
						<div className="mb-4">
							<h3 className="text-base sm:text-lg font-bold text-slate-900">
								5 Indikator Kesiapan Transisi
							</h3>
							<p className="text-xs sm:text-sm text-slate-600 mt-0.5">
								Skor 0–100 pada tiap aspek ketahanan finansial dan karier
							</p>
						</div>
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
					</Card>

					<ResultTimeline runwayMonths={runway} targetMonths={target} />
				</div>

				<div className="lg:col-span-4 space-y-5">
					{result.transition_role_name && (
						<Card padding="md">
							<div className="flex items-center gap-2.5 mb-2">
								<IconTile icon={Compass} tone="indigo" size="sm" />
								<div>
									<span className="text-xs font-semibold text-indigo-700">
										Target Transisi Karier
									</span>
									<p className="text-base font-bold text-slate-900">
										{result.transition_role_name}
									</p>
								</div>
							</div>
							{result.transition_gap_months != null && (
								<p className="text-xs text-slate-600 mt-1">
									Estimasi gap persiapan:{" "}
									<strong className="text-slate-900">
										{formatMonths(
											parseDecimal(result.transition_gap_months),
											"bulan",
										)}
									</strong>
									{result.transition_gap_status
										? ` (${result.transition_gap_status})`
										: ""}
								</p>
							)}
						</Card>
					)}

					<Card padding="md">
						<div className="flex items-center gap-2.5 mb-3">
							<IconTile icon={Compass} tone="indigo" size="sm" />
							<div>
								<h4 className="text-sm font-bold text-slate-900">
									Opsi Pivot Terdekat
								</h4>
								<p className="text-xs text-slate-500">
									Peran dengan kecocokan tertinggi
								</p>
							</div>
						</div>
						<div className="space-y-2">
							{pivotRoles.length > 0 ? (
								pivotRoles.map((option) => (
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
					</Card>

					<Card padding="md">
						<h4 className="text-sm font-bold text-slate-900 mb-3">
							Skill yang Perlu Diperkuat
						</h4>
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
					</Card>

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

			{result.action_items && result.action_items.length > 0 && (
				<Card padding="lg">
					<div className="flex items-center gap-3 mb-5">
						<IconTile icon={CheckSquare} tone="indigo" size="md" />
						<div>
							<h4 className="text-base sm:text-lg font-bold text-slate-900">
								Rencana Langkah Aksi Prioritas
							</h4>
							<p className="text-xs sm:text-sm text-slate-600 mt-0.5">
								Langkah konkret yang bisa kamu cicil mulai minggu ini
							</p>
						</div>
					</div>
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
				</Card>
			)}

			<Card
				padding="lg"
				className="text-center bg-indigo-950 border-indigo-900 text-white">
				<h3 className="text-lg sm:text-xl font-bold mb-1.5">
					PHK mungkin tidak selalu bisa kamu prediksi.
				</h3>
				<p className="text-sm text-indigo-100/85 max-w-xl mx-auto leading-relaxed">
					Namun dengan mengetahui angka runway dan langkah transisimu hari ini,
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
