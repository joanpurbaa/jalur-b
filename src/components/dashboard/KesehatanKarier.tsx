import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
	TrendingUp,
	Zap,
	RefreshCw,
	Plane,
	Wallet,
	HeartPulse,
	ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PageHeader from "../layouts/PageHeader";
import {
	getHealthStatus,
	localizeLevelLabel,
	normalizeConfidence,
} from "../../lib/status";
import StatusBadge from "../ui/StatusBadge";
import MeterBar from "../ui/MeterBar";
import ScoreRing from "../ui/ScoreRing";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import ExpandableText from "../ui/ExpandableText";
import { PrimaryButton, SecondaryButton } from "../ui/PrimaryButton";
import InfoTooltip from "../ui/InfoTooltip";
import { SkeletonHero, SkeletonStatCard } from "../ui/Skeleton";
import { Stagger, StaggerItem } from "../ui/Motion";
import FactorCard from "./FactorCard";
import { careerHealthApi } from "../../services/careerHealth";
import { parseDecimal } from "../../lib/parseNumeric";
import { formatDateID } from "../../lib/format";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";
import type {
	HealthAssessmentResult,
	HealthFactor,
} from "../../types/careerHealth";

const factorIcons: Record<string, LucideIcon> = {
	performance: TrendingUp,
	skill_relevance: Zap,
	adaptation: RefreshCw,
	adaptability: RefreshCw,
	readiness: Plane,
	financial: Wallet,
	financial_readiness: Wallet,
};

/** Pecah label menjadi maksimal 2 baris singkat agar selalu muat di radar. */
function wrapRadarLabel(title: string): string[] {
	const words = title.trim().split(/\s+/);
	if (words.length <= 1) return [title];
	if (title.length <= 14) return [title];
	const mid = Math.ceil(words.length / 2);
	const line1 = words.slice(0, mid).join(" ");
	const line2 = words.slice(mid).join(" ");
	return [
		line1.length > 16 ? `${line1.slice(0, 15)}…` : line1,
		line2.length > 16 ? `${line2.slice(0, 15)}…` : line2,
	];
}

/** Radar chart dengan viewBox lega + label multi-baris agar tidak pernah terpotong. */
function FactorRadar({ factors }: { factors: HealthFactor[] }) {
	const items = factors.slice(0, 6);
	if (items.length < 3) return null;

	const w = 340;
	const h = 264;
	const cx = w / 2;
	const cy = h / 2;
	const radius = 74;
	const n = items.length;

	const pointAt = (idx: number, pct: number) => {
		const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / n;
		const r = radius * pct;
		return [
			cx + r * Math.cos(angle),
			cy + r * Math.sin(angle),
			angle,
		] as const;
	};

	const polygonPoints = items
		.map((f, idx) => {
			const s = Math.max(8, Math.min(100, Math.round(parseDecimal(f.score))));
			const [x, y] = pointAt(idx, s / 100);
			return `${x.toFixed(1)},${y.toFixed(1)}`;
		})
		.join(" ");

	return (
		<div className="flex flex-col items-center w-full">
			<svg
				viewBox={`0 0 ${w} ${h}`}
				className="w-full max-w-[330px] h-auto"
				role="img"
				aria-label="Grafik radar keseimbangan faktor kesehatan karier">
				{[0.33, 0.66, 1].map((lvl) => {
					const ring = items
						.map((_, idx) => {
							const [x, y] = pointAt(idx, lvl);
							return `${x.toFixed(1)},${y.toFixed(1)}`;
						})
						.join(" ");
					return (
						<polygon
							key={lvl}
							points={ring}
							fill="none"
							stroke="rgba(15,23,42,0.1)"
							strokeDasharray={lvl < 1 ? "3 3" : undefined}
						/>
					);
				})}

				{items.map((_, idx) => {
					const [x, y] = pointAt(idx, 1);
					return (
						<line
							key={idx}
							x1={cx}
							y1={cy}
							x2={x}
							y2={y}
							stroke="rgba(15,23,42,0.08)"
						/>
					);
				})}

				<polygon
					points={polygonPoints}
					fill="rgba(79,70,229,0.14)"
					stroke="#4f46e5"
					strokeWidth={2}
				/>

				{items.map((f, idx) => {
					const s = Math.max(8, Math.min(100, Math.round(parseDecimal(f.score))));
					const [x, y] = pointAt(idx, s / 100);
					const [lx, ly, angle] = pointAt(idx, 1.24);
					const cos = Math.cos(angle);
					const anchor =
						Math.abs(cos) < 0.25 ? "middle" : cos > 0 ? "start" : "end";
					const lines = wrapRadarLabel(f.title);
					const startDy = lines.length > 1 ? -5 : 0;

					return (
						<g key={f.key}>
							<circle
								cx={x}
								cy={y}
								r={3.5}
								fill="#4f46e5"
								stroke="#ffffff"
								strokeWidth={1.5}
							/>
							<text
								x={lx}
								y={ly}
								textAnchor={anchor}
								dominantBaseline="middle"
								className="fill-slate-700 text-[11px] font-semibold">
								{lines.map((ln, lineIdx) => (
									<tspan
										key={lineIdx}
										x={lx}
										dy={lineIdx === 0 ? startDy : 13}>
										{ln}
									</tspan>
								))}
							</text>
						</g>
					);
				})}
			</svg>
			<p className="text-xs text-slate-500 font-medium mt-1">
				Keseimbangan Faktor Kesehatan
			</p>
		</div>
	);
}

export default function KesehatanKarier() {
	const { refreshKey, openCareerAssessment } = useCareerAssessment();

	const [result, setResult] = useState<HealthAssessmentResult | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;
		careerHealthApi
			.latest()
			.then((res) => {
				if (active) setResult(res);
			})
			.catch(() => {
				// belum ada penilaian — biarkan kosong
			})
			.finally(() => {
				if (active) setLoading(false);
			});
		return () => {
			active = false;
		};
	}, [refreshKey]);

	const score = result ? Math.round(parseDecimal(result.score)) : null;
	const statusVariant = result
		? getHealthStatus(result.status || result.level, score ?? undefined)
		: "neutral";
	const confidence = result ? normalizeConfidence(result.data_confidence) : 0;
	const assessedDate = result ? formatDateID(result.assessed_at) : "";

	const sortedFactors = useMemo(() => {
		if (!result?.factors) return [];
		return [...result.factors].sort(
			(a, b) => parseDecimal(a.score) - parseDecimal(b.score),
		);
	}, [result]);

	return (
		<div>
			<PageHeader
				title="Kesehatan Karier"
				subtitle="Lihat daya tahan posisi kariermu saat ini dan area mana yang paling layak diperkuat."
			/>

			{loading ? (
				<div className="space-y-6">
					<SkeletonHero />
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{[0, 1, 2].map((i) => (
							<SkeletonStatCard key={i} />
						))}
					</div>
				</div>
			) : result && score != null ? (
				<div className="space-y-8">
					{/* 1. Bagaimana kondisiku? */}
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
						<Card
							variant="hero"
							padding="lg"
							className="lg:col-span-7 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
							<ScoreRing
								value={score}
								max={100}
								size={156}
								stroke={13}
								status={statusVariant}
								suffix="/100"
								label="Skor Kesehatan Karier"
							/>

							<div className="flex-1 min-w-0 text-center md:text-left">
								<div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-2">
									<StatusBadge
										label={localizeLevelLabel(result.status)}
										variant={statusVariant}
									/>
									{assessedDate && (
										<span className="text-xs text-slate-500">
											Dinilai {assessedDate}
										</span>
									)}
								</div>

								<h2 className="text-xl font-bold text-slate-900">
									{statusVariant === "healthy"
										? "Kariermu berada di zona sehat dan adaptif"
										: statusVariant === "warning"
											? "Fondasi cukup baik, tinggal perkuat celahnya"
											: "Beberapa area kunci butuh perhatian segera"}
								</h2>

								<ExpandableText
									text={result.summary}
									maxLines={3}
									className="text-sm text-slate-600 mt-2.5 leading-relaxed"
								/>

								<div className="mt-5 pt-4 border-t border-slate-200/70 max-w-md mx-auto md:mx-0">
									<div className="flex justify-between items-center text-xs mb-1.5 font-medium">
										<span className="text-slate-600 flex items-center gap-1">
											Cakupan data analisis
											<InfoTooltip text="Tingkat kelengkapan informasi pada analisis ini, bukan skor ketepatan prediksi." />
										</span>
										<span className="text-indigo-700 font-semibold tabular">
											{confidence}%
										</span>
									</div>
									<MeterBar value={confidence} max={100} status="insight" height="sm" />
								</div>
							</div>
						</Card>

						<Card
							padding="md"
							className="lg:col-span-5 flex flex-col items-center justify-center">
							{sortedFactors.length >= 3 ? (
								<FactorRadar factors={result.factors} />
							) : (
								<div className="text-center p-4">
									<HeartPulse size={28} className="text-indigo-600 mx-auto mb-2" />
									<p className="text-sm font-semibold text-slate-900">
										Ringkasan Faktor
									</p>
									<p className="text-xs text-slate-500 mt-1">
										Faktor di bawah diurutkan dari skor terendah agar mudah
										diprioritaskan.
									</p>
								</div>
							)}
						</Card>
					</div>

					{/* 2. Kenapa begitu? */}
					<section aria-label="Faktor Kesehatan Karier">
						<div className="mb-4">
							<h3 className="text-base font-bold text-slate-900">
								Faktor Kesehatan Karier
							</h3>
							<p className="text-xs sm:text-sm text-slate-500">
								Diurutkan dari area yang paling perlu ditingkatkan lebih dulu
							</p>
						</div>

						<Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{sortedFactors.map((factor, idx) => (
								<StaggerItem key={factor.key}>
									<FactorCard
										title={factor.title}
										score={Math.round(parseDecimal(factor.score))}
										level={factor.level}
										explanation={factor.explanation}
										icon={factorIcons[factor.key] ?? TrendingUp}
										priorityRank={idx + 1}
									/>
								</StaggerItem>
							))}
						</Stagger>
					</section>

					{/* 3. Apa langkahku? */}
					<Card padding="md" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div>
							<h3 className="text-sm font-bold text-slate-900">
								Langkah Selanjutnya
							</h3>
							<p className="text-sm text-slate-600 mt-0.5">
								Lihat sinyal risiko pasar atau dokumentasikan pencapaian untuk
								menaikkan skor faktor terendahmu.
							</p>
						</div>
						<div className="flex flex-wrap items-center gap-3 shrink-0">
							<Link to="/dashboard/risiko-karier">
								<PrimaryButton icon={<ArrowRight size={15} />}>
									Cek Risiko Karier
								</PrimaryButton>
							</Link>
							{confidence < 100 && (
								<SecondaryButton onClick={openCareerAssessment}>
									Lengkapi Data Analisis
								</SecondaryButton>
							)}
						</div>
					</Card>
				</div>
			) : (
				<EmptyState
					icon={HeartPulse}
					tone="indigo"
					title="Belum ada penilaian kesehatan karier"
					description="Ceritakan peran, tanggung jawab, dan pencapaianmu supaya Jalur B bisa menghitung skor kesehatan karier serta faktor utamamu."
					action={
						<PrimaryButton onClick={openCareerAssessment}>
							Mulai Penilaian Karier
						</PrimaryButton>
					}
				/>
			)}
		</div>
	);
}
