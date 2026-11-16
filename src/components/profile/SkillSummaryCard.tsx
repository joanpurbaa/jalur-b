import { useEffect, useState } from "react";
import { ArrowRight, Cpu, TrendingUp } from "lucide-react";
import MetricCard from "../dashboard/MetricCard";
import SkillPill from "../ui/SkillPill";
import ActivityImpactBar from "../ui/ActivityImpactBar";
import Skeleton from "../ui/Skeleton";
import { aiExposureApi } from "../../services/aiExposure";
import { parseDecimal } from "../../lib/parseNumeric";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";
import type { AiExposureResult } from "../../types/aiExposure";

interface SkillSummaryCardProps {
	onSeeMore: () => void;
}

function clampPercent(value: number): number {
	return Math.min(100, Math.max(0, Math.round(value)));
}

function normalizeImpactLevel(
	value: string | null | undefined,
): "HIGH" | "MEDIUM" | "LOW" {
	const v = (value ?? "").toLowerCase();
	if (v.includes("high") || v.includes("tinggi")) return "HIGH";
	if (v.includes("low") || v.includes("rendah")) return "LOW";
	return "MEDIUM";
}

export default function SkillSummaryCard({ onSeeMore }: SkillSummaryCardProps) {
	const { refreshKey } = useCareerAssessment();
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

	if (loading) {
		return (
			<div>
				<div className="grid grid-cols-2 gap-4 mb-6">
					<Skeleton className="h-28 rounded-xl" />
					<Skeleton className="h-28 rounded-xl" />
				</div>
				<Skeleton className="h-6 w-3/4" />
			</div>
		);
	}

	if (!result) {
		return (
			<div className="text-center py-6">
				<p className="text-sm text-slate-600 mb-3">
					Belum ada penilaian Skill & AI.
				</p>
				<button
					type="button"
					onClick={onSeeMore}
					className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-800 cursor-pointer">
					Lihat Analisis Skill
					<ArrowRight size={13} />
				</button>
			</div>
		);
	}

	const exposureValue = clampPercent(parseDecimal(result.score));
	const relevance = clampPercent(parseDecimal(result.skill_relevance_score));

	return (
		<div>
			<div className="grid grid-cols-2 gap-4 mb-5">
				<MetricCard
					label="Paparan AI"
					value={`${exposureValue}%`}
					icon={Cpu}
					variant="insight"
				/>
				<MetricCard
					label="Relevansi Skill"
					value={`${relevance}%`}
					icon={TrendingUp}
					variant="insight"
				/>
			</div>

			{(result.strong_skills.length > 0 || result.rising_skills.length > 0) && (
				<div className="flex flex-wrap gap-2 mb-5">
					{result.strong_skills.slice(0, 4).map((skill) => (
						<SkillPill key={skill} label={skill} tone="neutral" />
					))}
					{result.rising_skills.slice(0, 2).map((skill) => (
						<SkillPill key={skill} label={skill} tone="insight" />
					))}
				</div>
			)}

			{result.activities.length > 0 && (
				<div className="space-y-3 mb-5">
					{result.activities.slice(0, 3).map((item) => (
						<ActivityImpactBar
							key={item.key || item.title}
							activity={item.title}
							level={normalizeImpactLevel(item.level)}
						/>
					))}
				</div>
			)}

			<button
				type="button"
				onClick={onSeeMore}
				className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-800 cursor-pointer">
				Lihat Analisis Skill
				<ArrowRight size={13} />
			</button>
		</div>
	);
}
