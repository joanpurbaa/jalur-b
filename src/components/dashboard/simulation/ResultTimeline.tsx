import { simulationData } from "../../../data/dashboardDummyData";
import { statusStyles, type StatusVariant } from "../../../lib/status";

export default function ResultTimeline() {
	return (
		<div className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-6">
			<h3 className="text-sm font-bold text-neutral mb-6">
				Kalau income berhenti besok
			</h3>
			<div className="relative">
				<div className="absolute left-0 right-0 top-2 h-0.5 bg-neutral/10" />
				<div className="flex justify-between relative">
					{simulationData.result.timeline.map((point) => {
						const s = statusStyles[point.variant as StatusVariant];
						return (
							<div
								key={point.label}
								className="flex flex-col items-start max-w-[160px]">
								<div className={`w-4 h-4 rounded-full ${s.bar} mb-3`} />
								<p className={`text-xs font-bold ${s.text}`}>{point.label}</p>
								<p className="text-xs text-neutral/50 mt-1 leading-relaxed">
									{point.status}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
