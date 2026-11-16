import { useEffect, useState } from "react";
import {
	Cpu,
	TrendingUp,
	ShieldCheck,
	ArrowUpRight,
	Wrench,
	Sparkles,
	Upload,
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
import { getInverseScoreStatus, getScoreStatus } from "../../lib/status";
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
	const confidence = result
		? clampPercent(parseDecimal(result.data_confidence) * 100)
		: 0;
	const panelDescription = result
		? `${result.summary}${confidence > 0 ? ` (Kelengkapan data ${confidence}%)` : ""}`
		: "";

	return (
		<div>
			<PageHeader
				title="Skill & AI"
				subtitle="Lihat porsi tugas yang terpapar otomasi AI dan perkuat skill yang membuat peranmu tak tergantikan."
				action={
					<PrimaryButton
						tone="skill"
						icon={<Upload size={15} />}
						onClick={openCareerAssessment}>
						{result ? "Perbarui Data Karier" : "Lengkapi Data Karier"}
					</PrimaryButton>
				}
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
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
						<FeaturedMetricCard
							title="AI Exposure"
							value={score}
							description="Porsi aktivitas rutin yang dapat dipercepat atau diotomasi dengan bantuan AI. Manfaatkan AI sebagai co-pilot untuk menghemat waktu."
							icon={Cpu}
							tone="skill"
							variant={getInverseScoreStatus(score)}
							ringColors={["#8b5cf6", "#06b6d4"]}
							badgeLabel={result.level || "Paparan AI"}
						/>
						<FeaturedMetricCard
							title="Skill Relevance"
							value={relevance}
							description="Daya saing dan relevansi portofolio keahlianmu terhadap kebutuhan industri saat ini maupun 1–2 tahun ke depan."
							icon={TrendingUp}
							tone="jalur-karier"
							variant={getScoreStatus(relevance)}
							ringColors={["#10b981", "#14b8a6"]}
							badgeLabel={
								relevance >= 75
									? "Sangat Relevan"
									: relevance >= 60
										? "Cukup Relevan"
										: "Perlu Diperkuat"
							}
						/>
					</div>

					{result.activities.length > 0 && (
						<ActivityImpactPanel
							description={panelDescription}
							activities={result.activities}
						/>
					)}

					<div className="mb-3">
						<h3 className="text-base sm:text-lg font-extrabold text-neutral">
							Peta Portofolio Skill
						</h3>
						<p className="text-xs sm:text-sm text-neutral/60">
							Kelompok skill berdasarkan daya tahan dan peluang pertumbuhannya
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
						<SkillAnalysisCard
							title="Skill Kuat"
							subtitle="Keunggulan utamamu saat ini"
							icon={ShieldCheck}
							tone="safe"
							variant="healthy"
							skills={result.strong_skills}
							pillTone="strong"
						/>
						<SkillAnalysisCard
							title="Skill Sedang Naik"
							subtitle="Makin dicari di pasar"
							icon={ArrowUpRight}
							tone="cyan"
							variant="insight"
							skills={result.rising_skills}
							pillTone="rising"
						/>
						<SkillAnalysisCard
							title="Perlu Diperkuat"
							subtitle="Prioritas latihan berikutnya"
							icon={Wrench}
							tone="caution"
							variant="warning"
							skills={result.skills_to_improve}
							pillTone="improve"
							ctaLabel="Catat bukti latihan di Bukti Karier"
							ctaHref="/dashboard/bukti-karier"
						/>
					</div>
				</>
			) : (
				<EmptyState
					icon={Sparkles}
					tone="skill"
					title="Belum ada pemetaan Skill & AI"
					description="Lengkapi penilaian karier agar Jalur B dapat mengukur tingkat AI exposure pada aktivitas harianmu dan menyusun rekomendasi skill."
					action={
						<PrimaryButton
							tone="skill"
							icon={<Sparkles size={15} />}
							onClick={openCareerAssessment}>
							Mulai Pemetaan Skill
						</PrimaryButton>
					}
				/>
			)}
		</div>
	);
}
