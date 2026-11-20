import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
	ArrowRight,
	Bot,
	PlaySquare,
	ShieldAlert,
	TrendingDown,
	TrendingUp,
	Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PageHeader from "../layouts/PageHeader";
import IconTile from "../ui/IconTile";
import RiskStatusCard from "./RiskStatusCard";
import RiskDimensionCard from "./RiskDimensionCard";
import AIAnalysisPanel from "./AIAnalysisPanel";
import EarlyWarningCard from "./EarlyWarningCard";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { PrimaryButton } from "../ui/PrimaryButton";
import { SkeletonHero, SkeletonStatCard } from "../ui/Skeleton";
import { Stagger, StaggerItem } from "../ui/Motion";
import { careerRiskApi } from "../../services/careerRisk";
import { loadManualCache, saveManualCache } from "../../lib/manualCache";
import { parseDecimal } from "../../lib/parseNumeric";
import { normalizeConfidence, normalizeRiskLevel } from "../../lib/status";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";
import type { CareerRiskResult } from "../../types/careerRisk";

const factorIcons: Record<string, LucideIcon> = {
	ai_disruption: Bot,
	automation: Zap,
	skill_dependency: TrendingDown,
	market_demand: TrendingUp,
	adaptability: TrendingUp,
};

export default function RisikoKarier() {
	const { refreshKey, openCareerAssessment } = useCareerAssessment();

	const cachedRisk = loadManualCache<CareerRiskResult>("career_risk");
	const [result, setResult] = useState<CareerRiskResult | null>(
		() => cachedRisk?.data ?? null,
	);
	const [loading, setLoading] = useState(() => !cachedRisk?.data);

	useEffect(() => {
		let active = true;
		careerRiskApi
			.latest()
			.then((res) => {
				if (active) {
					setResult(res);
					saveManualCache("career_risk", res);
				}
			})
			.catch(() => {
				// belum ada penilaian — pertahankan cache jika ada atau biarkan kosong
			})
			.finally(() => {
				if (active) setLoading(false);
			});
		return () => {
			active = false;
		};
	}, [refreshKey]);

	const level = normalizeRiskLevel(result?.level);
	const score = result ? Math.round(parseDecimal(result.score)) : 0;
	const confidence = result ? normalizeConfidence(result.data_confidence) : 0;

	return (
		<div>
			<PageHeader
				title="Risiko Karier"
				subtitle="Kenali sinyal pergeseran industri lebih awal agar kamu punya kendali penuh untuk bersiap."
			/>

			{loading ? (
				<div className="space-y-6">
					<SkeletonHero />
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<SkeletonStatCard />
						<SkeletonStatCard />
					</div>
				</div>
			) : result ? (
				<div className="space-y-6">
					{/* 1 & 2: Kondisi Risiko + Dimensi Penyebab */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
						<div className="lg:col-span-2">
							<RiskStatusCard
								level={level}
								summary={result.summary}
								score={score}
							/>

							<div className="mb-3.5 flex items-center gap-2.5">
								<IconTile icon={ShieldAlert} tone="indigo" size="xs" />
								<div>
									<h3 className="text-base font-bold text-slate-900">
										Empat Dimensi Risiko
									</h3>
									<p className="text-xs sm:text-sm text-slate-500">
										Indikator 3-level untuk tiap dimensi yang memengaruhi keamanan
										peranmu
									</p>
								</div>
							</div>

							<Stagger className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{result.factors.map((factor) => (
									<StaggerItem key={factor.key || factor.title}>
										<RiskDimensionCard
											title={factor.title}
											description={factor.explanation}
											level={normalizeRiskLevel(factor.level)}
											score={Math.round(parseDecimal(factor.score))}
											icon={factorIcons[factor.key] ?? ShieldAlert}
										/>
									</StaggerItem>
								))}
							</Stagger>
						</div>

						<AIAnalysisPanel
							description={result.analysis}
							confidence={confidence}
						/>
					</div>

					{/* 3. Apa langkahku? (Early Warning + Link ke Skill/Simulasi) */}
					{result.early_warning ? (
						<EarlyWarningCard description={result.early_warning} />
					) : (
						<Card
							padding="md"
							className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
							<div className="flex items-start gap-3">
								<IconTile icon={PlaySquare} tone="indigo" size="sm" />
								<div>
									<h3 className="text-sm font-bold text-slate-900">
										Langkah Antisipasi
									</h3>
									<p className="text-sm text-slate-600 mt-0.5">
										Uji skenario ketahananmu jika perubahan terjadi mendadak atau
										perkuat skill prioritasmu.
									</p>
								</div>
							</div>
							<Link to="/dashboard/simulasi" className="shrink-0">
								<PrimaryButton icon={<ArrowRight size={15} />}>
									Buka Simulasi
								</PrimaryButton>
							</Link>
						</Card>
					)}
				</div>
			) : (
				<EmptyState
					icon={ShieldAlert}
					tone="indigo"
					title="Belum ada pemindaian risiko karier"
					description="Isi penilaian karier singkat agar Jalur B dapat membaca tingkat risiko otomatisasi, ketergantungan skill, dan permintaan pasar pada peranmu."
					action={
						<PrimaryButton onClick={openCareerAssessment}>
							Mulai Pemindaian Risiko
						</PrimaryButton>
					}
				/>
			)}
		</div>
	);
}
