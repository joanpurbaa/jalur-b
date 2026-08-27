import { Cpu, TrendingUp, Settings2, ArrowUp, Wrench } from "lucide-react";
import PageHeader from "../layouts/PageHeader";
import { skillData } from "../../data/dashboardDummyData";
import { getScoreStatus } from "../../lib/status";
import FeaturedMetricCard from "./FeaturedMetricCard";
import ActivityImpactPanel from "./ActivityImpactPanel";
import SkillAnalysisCard from "./SkillAnalysisCard";

export default function Skill() {
	return (
		<div>
			<PageHeader
				title="Skill & AI"
				subtitle="Pahami skill mana yang masih kuat dan bagaimana AI mengubah pekerjaanmu."
			/>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
				<FeaturedMetricCard
					title="AI Exposure"
					value={skillData.aiExposure.value}
					description={skillData.aiExposure.description}
					icon={Cpu}
					variant="insight"
				/>
				<FeaturedMetricCard
					title="Skill Relevance"
					value={skillData.skillRelevance.value}
					description={skillData.skillRelevance.description}
					icon={TrendingUp}
					variant={getScoreStatus(skillData.skillRelevance.value)}
				/>
			</div>

			<ActivityImpactPanel />

			<h3 className="text-sm font-bold text-neutral mb-3">Analisis Skill</h3>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<SkillAnalysisCard
					title="Skill Kuat"
					icon={Settings2}
					variant="neutral"
					skills={skillData.strongSkills}
				/>
				<SkillAnalysisCard
					title="Skill Naik"
					icon={ArrowUp}
					variant="insight"
					skills={skillData.risingSkills}
					pillTone="insight"
				/>
				<SkillAnalysisCard
					title="Perlu Diperkuat"
					icon={Wrench}
					variant="risk"
					skills={skillData.skillsToImprove}
				/>
			</div>
		</div>
	);
}
