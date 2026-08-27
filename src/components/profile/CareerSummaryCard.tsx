import { AlertTriangle, Sparkles, Zap, Wallet, HeartPulse } from "lucide-react";
import {
	careerHealthData,
	careerSnapshots,
} from "../../data/dashboardDummyData";
import { getScoreStatus } from "../../lib/status";
import StatusBadge from "../ui/StatusBadge";
import MetricCard from "../dashboard/MetricCard";

const icons = [AlertTriangle, Sparkles, Zap, Wallet];

export default function CareerSummaryCard() {
	const status = getScoreStatus(careerHealthData.score);

	return (
		<div>
			<div className="bg-primary/5 rounded-xl border border-primary/20 p-6 flex items-center justify-between mb-4">
				<div>
					<div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-3">
						<HeartPulse size={14} />
						<span>Career Health Score</span>
					</div>
					<div className="flex items-baseline gap-3">
						<span className="text-4xl font-extrabold text-neutral">
							{careerHealthData.score}
							<span className="text-lg text-neutral/40 font-normal">/100</span>
						</span>
						<StatusBadge label={careerHealthData.status} variant={status} />
					</div>
				</div>
				<span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-200 shrink-0">
					{careerHealthData.trend}
				</span>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				{careerSnapshots
					.filter((item) => item.title !== "Financial Runway")
					.map((item, index) => (
						<MetricCard
							key={item.title}
							label={item.title}
							value={item.value}
							icon={icons[index]}
							variant={item.variant}
						/>
					))}
			</div>
		</div>
	);
}
