import { useEffect, useMemo, useState } from "react";
import {
	TrendingUp,
	Zap,
	RefreshCw,
	Plane,
	Wallet,
	Upload,
	Sparkles,
	HeartPulse,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PageHeader from "../layouts/PageHeader";
import { getScoreStatus } from "../../lib/status";
import StatusBadge from "../ui/StatusBadge";
import MeterBar from "../ui/MeterBar";
import ScoreRing from "../ui/ScoreRing";
import Card from "../ui/Card";
import IconTile from "../ui/IconTile";
import EmptyState from "../ui/EmptyState";
import { SkeletonHero, SkeletonStatCard } from "../ui/Skeleton";
import { PrimaryButton } from "../ui/PrimaryButton";
import InfoTooltip from "../ui/InfoTooltip";
import { Stagger, StaggerItem } from "../ui/Motion";
import FactorCard from "./FactorCard";
import { careerHealthApi } from "../../services/careerHealth";
import { parseDecimal } from "../../lib/parseNumeric";
import { formatDateID } from "../../lib/format";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";
import type { HealthAssessmentResult, HealthFactor } from "../../types/careerHealth";

const factorIcons: Record<string, LucideIcon> = {
	performance: TrendingUp,
	skill_relevance: Zap,
	adaptation: RefreshCw,
	adaptability: RefreshCw,
	readiness: Plane,
	financial: Wallet,
	financial_readiness: Wallet,
};

/** Radar chart SVG untuk memvisualisasikan keseimbangan faktor kesehatan karier. */
function FactorRadar({ factors }: { factors: HealthFactor[] }) {
	const items = factors.slice(0, 6);
	if (items.length < 3) return null;

	const size = 230;
	const cx = size / 2;
	const cy = size / 2;
	const radius = 76;
	const n = items.length;

	const pointAt = (idx: number, pct: number) => {
		const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / n;
		const r = radius * pct;
		return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as const;
	};

	const polygonPoints = items
		.map((f, idx) => {
			const s = Math.max(8, Math.min(100, Math.round(parseDecimal(f.score))));
			const [x, y] = pointAt(idx, s / 100);
			return `${x.toFixed(1)},${y.toFixed(1)}`;
		})
		.join(" ");

	return (
		<div className="flex flex-col items-center">
			<svg
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
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
							stroke="rgba(15,23,42,0.09)"
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
					fill="rgba(244,63,94,0.2)"
					stroke="#f43f5e"
					strokeWidth={2.5}
				/>

				{items.map((f, idx) => {
					const s = Math.max(8, Math.min(100, Math.round(parseDecimal(f.score))));
					const [x, y] = pointAt(idx, s / 100);
					const [lx, ly] = pointAt(idx, 1.24);
					const shortTitle = f.title.split(" ").slice(0, 2).join(" ");
					return (
						<g key={f.key}>
							<circle cx={x} cy={y} r={4} fill="#f43f5e" stroke="#fff" strokeWidth={1.5} />
							<text
								x={lx}
								y={ly}
								textAnchor="middle"
								dominantBaseline="middle"
								className="fill-slate-600 text-[10px] font-bold">
								{shortTitle}
							</text>
						</g>
					);
				})}
			</svg>
			<p className="text-xs text-neutral/55 font-medium -mt-2">
				Peta Keseimbangan Faktor
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
	const statusVariant = score != null ? getScoreStatus(score) : "neutral";
	const confidence = result
		? Math.min(
				100,
				Math.max(0, Math.round(parseDecimal(result.data_confidence) * 100)),
			)
		: 0;
	const assessedDate = result ? formatDateID(result.assessed_at) : "";

	// Urutkan faktor dari yang paling perlu perhatian (skor terendah lebih dulu)
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
				subtitle="Lihat daya tahan posisi kariermu saat ini dan area mana yang paling layak diperkuat lebih dulu."
				action={
					<PrimaryButton
						tone="kesehatan-karier"
						icon={<Upload size={15} />}
						onClick={openCareerAssessment}>
						{result ? "Perbarui Data Karier" : "Lengkapi Data Karier"}
					</PrimaryButton>
				}
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
				<>
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 items-stretch">
						<Card
							padding="lg"
							className="lg:col-span-8 flex flex-col md:flex-row items-center gap-6 sm:gap-8 bg-gradient-to-br from-white via-rose-50/35 to-orange-50/30">
							<ScoreRing
								value={score}
								max={100}
								size={168}
								stroke={15}
								status={statusVariant}
								suffix="/100"
								label="Skor Kesehatan Karier"
							/>

							<div className="flex-1 min-w-0 text-center md:text-left">
								<div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-2">
									<StatusBadge label={result.status} variant={statusVariant} />
									{assessedDate && (
										<span className="text-xs font-medium text-neutral/50">
											Dinilai {assessedDate}
										</span>
									)}
								</div>
								<h2 className="text-xl sm:text-2xl font-extrabold text-neutral">
									{score >= 75
										? "Kariermu berada di zona sehat dan adaptif"
										: score >= 60
											? "Fondasi kariermu cukup baik, tinggal perkuat celahnya"
											: "Ada beberapa area kunci yang bisa kita angkat bertahap"}
								</h2>
								<p className="text-sm sm:text-[15px] text-neutral/75 mt-2.5 leading-relaxed">
									{result.summary}
								</p>

								<div className="mt-5 pt-4 border-t border-rose-100/80 max-w-md mx-auto md:mx-0">
									<div className="flex justify-between items-center text-xs mb-1.5 font-semibold">
										<span className="text-neutral/60 flex items-center gap-1">
											Kelengkapan data analisis
											<InfoTooltip text="Seberapa lengkap data yang kamu isi. Semakin lengkap, semakin tajam rekomendasi Jalur B." />
										</span>
										<span className="text-rose-700 font-bold tabular">
											{confidence}%
										</span>
									</div>
									<MeterBar
										value={confidence}
										max={100}
										colors={["#f43f5e", "#fb923c"]}
										height="sm"
									/>
								</div>
							</div>
						</Card>

						<Card
							padding="md"
							className="lg:col-span-4 flex flex-col items-center justify-center">
							{sortedFactors.length >= 3 ? (
								<FactorRadar factors={result.factors} />
							) : (
								<div className="text-center p-4">
									<IconTile icon={HeartPulse} tone="kesehatan-karier" size="lg" />
									<p className="text-sm font-bold text-neutral mt-3">
										Ringkasan Faktor
									</p>
									<p className="text-xs text-neutral/60 mt-1">
										Faktor di bawah diurutkan mulai dari skor terendah agar kamu
										tahu fokus pertama.
									</p>
								</div>
							)}
						</Card>
					</div>

					<section aria-label="Faktor Kesehatan Karier">
						<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
							<div>
								<h3 className="text-base sm:text-lg font-extrabold text-neutral">
									Faktor Kesehatan Karier
								</h3>
								<p className="text-xs sm:text-sm text-neutral/60">
									Diurutkan dari area yang paling membutuhkan perhatianmu lebih dulu
								</p>
							</div>
						</div>

						<Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{sortedFactors.map((factor, idx) => (
								<StaggerItem key={factor.key}>
									<FactorCard
										title={factor.title}
										score={Math.round(parseDecimal(factor.score))}
										level={factor.level}
										explanation={factor.explanation}
										icon={factorIcons[factor.key] ?? Sparkles}
										priorityRank={idx + 1}
									/>
								</StaggerItem>
							))}
						</Stagger>
					</section>
				</>
			) : (
				<EmptyState
					icon={HeartPulse}
					tone="kesehatan-karier"
					title="Belum ada penilaian kesehatan karier"
					description="Ceritakan peran, tanggung jawab, dan pencapaianmu supaya Jalur B bisa menghitung skor kesehatan karier dan memetakan faktor terkuatmu."
					action={
						<PrimaryButton
							tone="kesehatan-karier"
							icon={<Sparkles size={15} />}
							onClick={openCareerAssessment}>
							Mulai Penilaian Karier
						</PrimaryButton>
					}
				/>
			)}
		</div>
	);
}
