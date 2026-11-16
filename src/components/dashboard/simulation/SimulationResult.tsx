import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
	Sparkles,
	TrendingDown,
	HeartPulse,
	Zap,
	Compass,
	Wallet as WalletIcon,
	CheckSquare,
	RotateCcw,
	FolderCheck,
	ArrowRight,
	Target,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getRunwayStatus, getScoreStatus } from "../../../lib/status";
import { formatDateID, formatDecimal1 } from "../../../lib/format";
import { celebrate } from "../../../lib/motion";
import ScoreRing from "../../ui/ScoreRing";
import MeterBar from "../../ui/MeterBar";
import StatusBadge from "../../ui/StatusBadge";
import Card from "../../ui/Card";
import IconTile from "../../ui/IconTile";
import { PrimaryButton } from "../../ui/PrimaryButton";
import { CountUp, Stagger, StaggerItem } from "../../ui/Motion";
import ResultTimeline from "./ResultTimeline";
import { careerPivotApi } from "../../../services/careerPivot";
import { aiExposureApi } from "../../../services/aiExposure";
import { parseDecimal } from "../../../lib/parseNumeric";
import type { LayoffSimulationResult } from "../../../types/layoffSimulation";
import type { Tone } from "../../../lib/modules";

interface ReadinessItem {
	label: string;
	value: number;
	icon: LucideIcon;
	tone: Tone;
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
	const runwayVariant = getRunwayStatus(runway, target);
	const diff = runway - target;
	const isSurplus = diff >= 0;
	const maxScale = Math.max(target * 1.4, runway * 1.15, 12);
	const simulatedDate = result.simulated_at
		? formatDateID(result.simulated_at)
		: "";

	useEffect(() => {
		if (runway >= target || overallScore >= 70) {
			void celebrate({ intensity: "small" });
		}
	}, [runway, target, overallScore]);

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
			tone: "finansial",
		},
		{
			label: "Career Readiness",
			value: clampScore(result.career_readiness_score),
			icon: HeartPulse,
			tone: "kesehatan-karier",
		},
		{
			label: "Skill Relevance",
			value: clampScore(result.skill_relevance_score),
			icon: Zap,
			tone: "skill",
		},
		{
			label: "Job Mobility",
			value: clampScore(result.job_mobility_score),
			icon: Compass,
			tone: "jalur-karier",
		},
		{
			label: "Overall Resilience",
			value: overallScore,
			icon: Sparkles,
			tone: "simulasi",
		},
	];

	return (
		<div className="space-y-6">
			{/* Ringkasan & CTA Jalankan Ulang */}
			<Card
				padding="lg"
				className="bg-gradient-to-r from-indigo-50/80 via-white to-fuchsia-50/70 flex flex-col md:flex-row md:items-center justify-between gap-5">
				<div className="flex items-start gap-4">
					<IconTile icon={Sparkles} tone="simulasi" size="md" />
					<div>
						<div className="flex flex-wrap items-center gap-2 mb-1">
							<span className="text-xs font-extrabold uppercase tracking-wider text-fuchsia-700">
								Ringkasan Proyeksi Simulasi
							</span>
							<StatusBadge
								variant={getScoreStatus(overallScore)}
								label={`Resilience ${overallScore}/100`}
								size="sm"
							/>
						</div>
						<p className="text-sm sm:text-[15px] text-neutral/85 leading-relaxed max-w-3xl">
							{result.summary ||
								"Simulasi selesai dihitung berdasarkan kondisi karier, tabungan likuid, dan ketentuan kerjamu."}
						</p>
						<p className="text-xs font-medium text-neutral/55 mt-2">
							Skenario:{" "}
							<strong className="text-neutral">
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
						<PrimaryButton
							tone="simulasi"
							icon={<RotateCcw size={15} />}
							onClick={onRerun}>
							Jalankan Ulang
						</PrimaryButton>
					</div>
				)}
			</Card>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
				<div className="lg:col-span-8 space-y-6">
					{/* Runway Reveal Card dengan warna semantik yang diperbaiki */}
					<Card
						padding="lg"
						className={
							runwayVariant === "healthy"
								? "bg-gradient-to-br from-white via-emerald-50/45 to-teal-50/35"
								: runwayVariant === "warning"
									? "bg-gradient-to-br from-white via-amber-50/45 to-orange-50/35"
									: "bg-gradient-to-br from-white via-rose-50/45 to-orange-50/35"
						}>
						<div className="flex flex-wrap items-center justify-between gap-2 mb-3">
							<span className="text-xs font-extrabold uppercase tracking-wider text-neutral/60">
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
								<h3 className="text-lg sm:text-xl font-extrabold text-neutral max-w-lg leading-snug">
									Kamu masih punya waktu sekitar{" "}
									<span
										className={
											runwayVariant === "healthy"
												? "text-emerald-700"
												: runwayVariant === "warning"
													? "text-amber-700"
													: "text-rose-600"
										}>
										{formatDecimal1(runway)} bulan
									</span>{" "}
									napas finansial untuk bertransisi dengan tenang.
								</h3>
								<p className="text-xs sm:text-sm text-neutral/65 mt-1">
									{isSurplus
										? `Surplus +${formatDecimal1(Math.abs(diff))} bulan di atas target aman ${formatDecimal1(target)} bulan.`
										: `Masih butuh sekitar ${formatDecimal1(Math.abs(diff))} bulan lagi untuk menyentuh target aman ${formatDecimal1(target)} bulan.`}
								</p>
							</div>

							<div className="text-left sm:text-right shrink-0">
								<span
									className={`num-display text-5xl ${
										runwayVariant === "healthy"
											? "text-emerald-600"
											: runwayVariant === "warning"
												? "text-amber-600"
												: "text-rose-600"
									}`}>
									<CountUp
										value={runway}
										decimals={1}
										format={(n) => formatDecimal1(n)}
									/>
								</span>
								<p className="text-xs font-bold text-neutral/50 mt-0.5">
									bulan runway
								</p>
							</div>
						</div>

						<div className="flex items-center justify-between text-xs font-bold text-neutral/60 mb-2">
							<span>0 bln</span>
							<span className="inline-flex items-center gap-1 text-neutral">
								<Target size={12} />
								Target: {formatDecimal1(target)} bln
							</span>
							<span>{formatDecimal1(maxScale)} bln</span>
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

					{/* Lima Skor sebagai Ring Mini */}
					<Card padding="lg">
						<div className="mb-4">
							<h3 className="text-base sm:text-lg font-extrabold text-neutral">
								5 Indikator Kesiapan Transisi
							</h3>
							<p className="text-xs sm:text-sm text-neutral/60">
								Skor 0–100 pada tiap aspek ketahanan finansial dan karier
							</p>
						</div>
						<Stagger className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3.5">
							{readiness.map((item) => {
								const st = getScoreStatus(item.value);
								return (
									<StaggerItem
										key={item.label}
										className="rounded-2xl border border-slate-200/80 bg-white/90 p-3.5 flex flex-col items-center text-center">
										<ScoreRing
											value={item.value}
											max={100}
											size={82}
											stroke={8}
											status={st}
											suffix="/100"
											label={item.label}
										/>
										<p className="text-xs font-extrabold text-neutral mt-2.5 leading-snug">
											{item.label}
										</p>
									</StaggerItem>
								);
							})}
						</Stagger>
					</Card>

					<ResultTimeline runwayMonths={runway} targetMonths={target} />
				</div>

				{/* Kolom Kanan: Transisi, Pivot, Skill, Bukti */}
				<div className="lg:col-span-4 space-y-5">
					{result.transition_role_name && (
						<Card padding="md">
							<div className="flex items-center gap-2.5 mb-2">
								<IconTile icon={Compass} tone="jalur-karier" size="sm" />
								<div>
									<span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
										Target Transisi Karier
									</span>
									<p className="text-base font-extrabold text-neutral">
										{result.transition_role_name}
									</p>
								</div>
							</div>
							{result.transition_gap_months != null && (
								<p className="text-xs text-neutral/65 mt-1">
									Estimasi gap persiapan:{" "}
									<strong className="text-neutral">
										{formatDecimal1(parseDecimal(result.transition_gap_months))}{" "}
										bulan
									</strong>
									{result.transition_gap_status
										? ` (${result.transition_gap_status})`
										: ""}
								</p>
							)}
						</Card>
					)}

					<Card
						padding="md"
						className="bg-gradient-to-br from-indigo-50/70 via-white to-violet-50/50">
						<div className="flex items-center gap-2.5 mb-3">
							<IconTile icon={Sparkles} tone="beranda" size="sm" />
							<div>
								<h4 className="text-sm font-extrabold text-neutral">
									Opsi Pivot Terdekat
								</h4>
								<p className="text-xs text-neutral/55">
									Peran dengan kecocokan tertinggi
								</p>
							</div>
						</div>
						<div className="space-y-2">
							{pivotRoles.length > 0 ? (
								pivotRoles.map((option) => (
									<div
										key={option.role}
										className="bg-white rounded-xl p-3 border border-slate-200/80 flex items-center justify-between gap-2">
										<span className="text-xs sm:text-sm font-bold text-neutral truncate">
											{option.role}
										</span>
										<span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shrink-0">
											{option.match}% cocok
										</span>
									</div>
								))
							) : (
								<p className="text-xs text-neutral/55">
									Lengkapi penilaian karier untuk melihat rekomendasi pivot.
								</p>
							)}
						</div>
					</Card>

					<Card padding="md">
						<h4 className="text-sm font-extrabold text-neutral mb-3">
							Skill yang Perlu Diperkuat
						</h4>
						<div className="space-y-2.5">
							{weaknesses.length > 0 ? (
								weaknesses.map((skill) => (
									<div
										key={skill}
										className="flex items-center justify-between gap-2 rounded-xl bg-amber-50/70 border border-amber-200/80 px-3 py-2">
										<div className="flex items-center gap-2 min-w-0">
											<TrendingDown
												size={14}
												className="text-amber-600 shrink-0"
											/>
											<span className="text-xs font-bold text-neutral truncate">
												{skill}
											</span>
										</div>
										<span className="text-[10px] font-extrabold text-amber-800 uppercase">
											Prioritas
										</span>
									</div>
								))
							) : (
								<p className="text-xs text-neutral/55">
									Belum ada rekomendasi skill spesifik.
								</p>
							)}
						</div>
					</Card>

					<Card padding="md">
						<div className="flex items-center gap-3 mb-2">
							<IconTile icon={FolderCheck} tone="bukti-karier" size="sm" />
							<div>
								<h4 className="text-sm font-extrabold text-neutral">
									Portofolio Bukti Karier
								</h4>
								<p className="text-xs text-neutral/60">
									Kamu memiliki{" "}
									<strong className="text-sky-700">
										{result.evidence_count} bukti tersimpan
									</strong>
								</p>
							</div>
						</div>
						<Link
							to="/dashboard/bukti-karier"
							className="press mt-2 inline-flex items-center justify-between w-full px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100/80 border border-sky-200 text-xs font-bold text-sky-900">
							<span>Tambah bukti pencapaian</span>
							<ArrowRight size={13} />
						</Link>
					</Card>
				</div>
			</div>

			{/* Action Items sebagai Kartu Bernomor Berikon dan Berprioritas */}
			{result.action_items && result.action_items.length > 0 && (
				<Card padding="lg">
					<div className="flex items-center gap-3 mb-5">
						<IconTile icon={CheckSquare} tone="simulasi" size="md" />
						<div>
							<h4 className="text-base sm:text-lg font-extrabold text-neutral">
								Rencana Langkah Aksi Prioritas
							</h4>
							<p className="text-xs sm:text-sm text-neutral/60">
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
									className="rounded-2xl border border-slate-200/90 bg-white/90 p-4 flex flex-col justify-between gap-3 shadow-2xs">
									<div>
										<div className="flex items-center justify-between gap-2 mb-2.5">
											<span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white text-xs font-extrabold shadow-xs">
												0{idx + 1}
											</span>
											<span
												className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
													isHigh
														? "bg-amber-50 text-amber-800 border-amber-200"
														: "bg-indigo-50 text-indigo-700 border-indigo-200"
												}`}>
												{isHigh ? "Prioritas Utama" : `Tahap ${idx + 1}`}
											</span>
										</div>
										<p className="text-sm font-extrabold text-neutral leading-snug">
											{title}
										</p>
										{desc && (
											<p className="text-xs text-neutral/70 mt-1.5 leading-relaxed">
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
				className="text-center bg-gradient-to-r from-indigo-600 via-violet-700 to-fuchsia-700 text-white">
				<h3 className="text-lg sm:text-xl font-extrabold mb-1">
					PHK mungkin tidak selalu bisa kamu prediksi.
				</h3>
				<p className="text-sm text-indigo-100 max-w-xl mx-auto">
					Namun dengan mengetahui angka runway dan langkah transisimu hari ini,
					kamu memegang kendali penuh atas apa yang terjadi setelahnya.
				</p>
				{onRerun && (
					<div className="mt-4 flex justify-center">
						<button
							type="button"
							onClick={onRerun}
							className="press inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-800 text-xs sm:text-sm font-bold shadow-md cursor-pointer">
							<RotateCcw size={14} />
							Uji Skenario Lain
						</button>
					</div>
				)}
			</Card>
		</div>
	);
}
