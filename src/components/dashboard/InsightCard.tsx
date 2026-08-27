import { Sparkles } from "lucide-react";
import { weeklyFocus } from "../../data/dashboardDummyData";
import { SecondaryButton } from "../ui/PrimaryButton";

export default function InsightCard() {
	return (
		<div>
			<div className="flex items-center gap-2 text-primary font-bold text-sm mb-3">
				<Sparkles size={16} />
				<span>Career Insight</span>
			</div>
			<div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 flex flex-col justify-between h-44">
				<p className="text-sm text-neutral/80 leading-relaxed">
					<strong className="text-neutral">"{weeklyFocus.skill}"</strong>{" "}
					{weeklyFocus.description}
				</p>
				<a href="/dashboard/risiko-karier">
					<SecondaryButton>Pelajari kenapa →</SecondaryButton>
				</a>
			</div>
		</div>
	);
}
