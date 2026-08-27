import { Ban, Wallet, Search, GitFork, Briefcase } from "lucide-react";
import { simulationData } from "../../../data/dashboardDummyData";
import { statusStyles, type StatusVariant } from "../../../lib/status";

const iconMap = { Ban, Wallet, Search, GitFork, Briefcase };

export default function JourneyTimeline() {
	return (
		<div className="bg-neutral/5 rounded-2xl p-6 relative">
			<p className="text-[11px] font-semibold text-neutral/50 uppercase tracking-wide mb-5">
				Simulation Journey
			</p>
			<div className="relative">
				<div className="absolute left-[17px] top-2 bottom-2 border-l-2 border-dashed border-neutral/15" />
				<div className="space-y-5">
					{simulationData.journey.map((item) => {
						const Icon = iconMap[item.icon as keyof typeof iconMap];
						const s = statusStyles[item.variant as StatusVariant];
						return (
							<div key={item.id} className="flex items-start gap-4 relative">
								<div
									className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 ${s.iconBg}`}>
									<Icon size={16} className={s.text} />
								</div>
								<div>
									<p className="text-sm font-bold text-neutral">{item.title}</p>
									<p className="text-xs text-neutral/50 mt-0.5">{item.description}</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
