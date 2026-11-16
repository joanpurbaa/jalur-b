import { useEffect, useState } from "react";
import {
	Bot,
	ShieldAlert,
	Sparkles,
	TrendingDown,
	TrendingUp,
	Upload,
	Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PageHeader from "../layouts/PageHeader";
import RiskStatusCard from "./RiskStatusCard";
import RiskDimensionCard from "./RiskDimensionCard";
import AIAnalysisPanel from "./AIAnalysisPanel";
import EarlyWarningCard from "./EarlyWarningCard";
import EmptyState from "../ui/EmptyState";
import { PrimaryButton } from "../ui/PrimaryButton";
import { SkeletonHero, SkeletonStatCard } from "../ui/Skeleton";
import { Stagger, StaggerItem } from "../ui/Motion";
import { careerRiskApi } from "../../services/careerRisk";
import { parseDecimal } from "../../lib/parseNumeric";
import { normalizeRiskLevel } from "../../lib/status";
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

	const [result, setResult] = useState<CareerRiskResult | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;
		careerRiskApi
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

	const level = normalizeRiskLevel(result?.level);
	const score = result ? Math.round(parseDecimal(result.score)) : 0;
	const confidence = result
		? Math.min(
				100,
				Math.max(0, Math.round(parseDecimal(result.data_confidence) * 100)),
			)
		: 0;

	return (
		<div>
			<PageHeader
				title="Risiko Karier"
				subtitle="Kenali sinyal pergeseran industri lebih awal supaya kamu punya waktu dan kendali penuh untuk bersiap."
				action={
					<PrimaryButton
						tone="risiko-karier"
						icon={<Upload size={15} />}
						onClick={openCareerAssessment}>
						{result ? "Perbarui Data Karier" : "Lengkapi Data Karier"}
					</PrimaryButton>
				}
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
				<>
					{result.early_warning && (
						<div className="mb-6">
							<EarlyWarningCard description={result.early_warning} />
						</div>
					)}

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-start">
						<div className="lg:col-span-2">
							<RiskStatusCard
								level={level}
								summary={result.summary}
								score={score}
							/>

							<div className="mb-3">
								<h3 className="text-base sm:text-lg font-extrabold text-neutral">
									Empat Dimensi Risiko
								</h3>
								<p className="text-xs sm:text-sm text-neutral/60">
									Indikator 3-level pada tiap dimensi yang memengaruhi keamanan
									peranmu
								</p>
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
				</>
			) : (
				<EmptyState
					icon={ShieldAlert}
					tone="risiko-karier"
					title="Belum ada pemindaian risiko karier"
					description="Isi penilaian karier singkat agar Jalur B dapat membaca tingkat risiko otomatisasi, ketergantungan skill, dan permintaan pasar pada peranmu."
					action={
						<PrimaryButton
							tone="risiko-karier"
							icon={<Sparkles size={15} />}
							onClick={openCareerAssessment}>
							Mulai Pemindaian Risiko
						</PrimaryButton>
					}
				/>
			)}
		</div>
	);
}
