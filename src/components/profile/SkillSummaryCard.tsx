import { Cpu, TrendingUp } from "lucide-react";
import { skillData } from "../../data/dashboardDummyData";
import { getScoreStatus } from "../../lib/status";
import MetricCard from "../dashboard/MetricCard";
import ActivityImpactBar from "../ui/ActivityImpactBar";
import SkillPill from "../ui/SkillPill";

interface SkillSummaryCardProps {
	onSeeMore: () => void;
}

export default function SkillSummaryCard({ onSeeMore }: SkillSummaryCardProps) {
	return (
		<div>
			<div className="grid grid-cols-2 gap-4 mb-6">
				<MetricCard
					label="AI Exposure"
					value={`${skillData.aiExposure.value}%`}
					icon={Cpu}
					variant="insight"
				/>
				<MetricCard
					label="Skill Relevance"
					value={`${skillData.skillRelevance.value}%`}
					icon={TrendingUp}
					variant={getScoreStatus(skillData.skillRelevance.value)}
				/>
			</div>

			<div className="space-y-3 mb-6">
				{skillData.activityImpact.slice(0, 3).map((item) => (
					<ActivityImpactBar
						key={item.activity}
						activity={item.activity}
						level={item.level as "HIGH" | "MEDIUM" | "LOW"}
					/>
				))}
			</div>

			<div className="flex flex-wrap gap-2 mb-1">
				{skillData.strongSkills.map((skill) => (
					<SkillPill key={skill} label={`Skill Kuat: ${skill}`} />
				))}
				{skillData.risingSkills.slice(0, 2).map((skill) => (
					<SkillPill key={skill} label={`Naik: ${skill}`} tone="insight" />
				))}
			</div>

			<button
				type="button"
				onClick={onSeeMore}
				className="text-xs font-semibold text-primary hover:opacity-70 transition mt-4">
				Lihat Analisis Skill →
			</button>
		</div>
	);
}
