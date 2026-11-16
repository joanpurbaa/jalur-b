import { useEffect, useState } from "react";
import {
	Cpu,
	TrendingUp,
	ShieldCheck,
	ArrowUpRight,
	Wrench,
} from "lucide-react";
import PageHeader from "../layouts/PageHeader";
import FeaturedMetricCard from "./FeaturedMetricCard";
import ActivityImpactPanel from "./ActivityImpactPanel";
import SkillAnalysisCard from "./SkillAnalysisCard";
import EmptyState from "../ui/EmptyState";
import { PrimaryButton } from "../ui/PrimaryButton";
import { SkeletonHero, SkeletonStatCard } from "../ui/Skeleton";
import { aiExposureApi } from "../../services/aiExposure";
import { parseDecimal } from "../../lib/parseNumeric";
import { localizeLevelLabel, normalizeConfidence } from "../../lib/status";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";
import type { AiExposureResult } from "../../types/aiExposure";

function clampPercent(value: number): number {
	return Math.min(100, Math.max(0, Math.round(value)));
}

export default function Skill() {
	const { refreshKey, openCareerAssessment } = useCareerAssessment();

	const [result, setResult] = useState<AiExposureResult | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;
		aiExposureApi
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

	const score = result ? clampPercent(parseDecimal(result.score)) : 0;
	const relevance = result
		? clampPercent(parseDecimal(result.skill_relevance_score))
		: 0;
	const confidence = result ? normalizeConfidence(result.data_confidence) : 0;
	const panelDescription = result
		? `${result.summary}${confidence > 0 ? ` (Cakupan data analisis: ${confidence}%)` : ""}`
		: "";

	return (
		<div>
			<PageHeader
				title="Skill & AI"
				subtitle="Lihat porsi tugas yang terpapar otomasi AI dan perkuat keahlian yang menjaga posisi tawarmu."
			/>

			{loading ? (
				<div className="space-y-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<SkeletonHero />
						<SkeletonHero />
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
						<SkeletonStatCard />
						<SkeletonStatCard />
						<SkeletonStatCard />
					</div>
				</div>
			) : result ? (
				<>
					{/* 1. Bagaimana kondisiku? */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
						<FeaturedMetricCard
							title="Paparan AI (AI Exposure)"
							value={score}
							description="Porsi aktivitas rutin yang dapat dipercepat AI. Jadikan AI sebagai co-pilot untuk efisiensi kerja."
							icon={Cpu}
							badgeLabel={localizeLevelLabel(result.level)}
						/>
						<FeaturedMetricCard
							title="Relevansi Skill"
							value={relevance}
							description="Kesesuaian portofolio keahlianmu terhadap kebutuhan industri saat ini maupun ke depan."
							icon={TrendingUp}
						/>
					</div>

					{/* 2. Kenapa begitu? */}
					{result.activities.length > 0 && (
						<ActivityImpactPanel
							description={panelDescription}
							activities={result.activities}
						/>
					)}

					{/* 3. Peta skill & langkah penguatan */}
					<div className="mb-3.5">
						<h3 className="text-base font-bold text-slate-900">
							Portofolio Skill
						</h3>
						<p className="text-xs sm:text-sm text-slate-500">
							Kelompok keahlian berdasarkan kekuatan, tren permintaan, dan area
							penguatan
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
						<SkillAnalysisCard
							title="Skill Kuat"
							subtitle="Keunggulan utamamu saat ini"
							icon={ShieldCheck}
							skills={result.strong_skills}
						/>
						<SkillAnalysisCard
							title="Skill Sedang Naik"
							subtitle="Makin dicari di pasar"
							icon={ArrowUpRight}
							skills={result.rising_skills}
						/>
						<SkillAnalysisCard
							title="Perlu Diperkuat"
							subtitle="Prioritas latihan berikutnya"
							icon={Wrench}
							skills={result.skills_to_improve}
							ctaLabel="Catat bukti di Bukti Karier"
							ctaHref="/dashboard/bukti-karier"
						/>
					</div>
				</>
			) : (
				<EmptyState
					icon={Cpu}
					tone="indigo"
					title="Belum ada pemetaan Skill & AI"
					description="Lengkapi penilaian karier agar Jalur B dapat mengukur tingkat paparan AI pada aktivitas harianmu dan menyusun rekomendasi skill."
					action={
						<PrimaryButton onClick={openCareerAssessment}>
							Mulai Pemetaan Skill
						</PrimaryButton>
					}
				/>
			)}
		</div>
	);
}
