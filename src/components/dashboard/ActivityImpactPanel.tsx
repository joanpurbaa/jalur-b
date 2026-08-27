import { Sparkles } from "lucide-react";
import { skillData } from "../../data/dashboardDummyData";
import ActivityImpactBar from "../ui/ActivityImpactBar";

export default function ActivityImpactPanel() {
	return (
		<div className="bg-primary/5 rounded-2xl border border-primary/20 border-l-4 border-l-primary shadow-sm p-8 mb-8">
			<div className="flex items-center gap-2 text-primary font-bold text-sm mb-1">
				<Sparkles size={16} />
				<span>Peta Aktivitas & AI Impact</span>
			</div>
			<p className="text-xs text-neutral/60 mb-6">
				Intensitas dampak AI pada rutinitas kerjamu saat ini.
			</p>

			<div className="space-y-4">
				{skillData.activityImpact.map((item) => (
					<ActivityImpactBar
						key={item.activity}
						activity={item.activity}
						level={item.level as "HIGH" | "MEDIUM" | "LOW"}
					/>
				))}
			</div>
		</div>
	);
}
