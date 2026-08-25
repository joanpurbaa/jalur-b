import { AlertTriangle, Sparkles, Zap, Wallet } from "lucide-react";
import { careerSnapshots } from "../../data/dashboardDummyData";
import MetricCard from "./MetricCard";

const icons = [AlertTriangle, Sparkles, Zap, Wallet];

export default function CareerSnapshotGrid() {
	return (
		<div className="mb-8">
			<h3 className="text-sm font-bold text-neutral mb-3">Career Snapshot</h3>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{careerSnapshots.map((item, index) => (
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
