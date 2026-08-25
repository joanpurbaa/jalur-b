import { AlertTriangle } from "lucide-react";
import { riskData } from "../../data/dashboardDummyData";
import { getLevelStatus, statusStyles } from "../../lib/status";
import StatusBadge from "../ui/StatusBadge";

export default function RiskStatusCard() {
	const variant = getLevelStatus(riskData.overallLevel);
	const s = statusStyles[variant];

	return (
		<div className="bg-white rounded-2xl p-8 border border-neutral/5 shadow-md flex flex-col sm:flex-row items-start gap-5 mb-6">
			<div
				className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${s.iconBg}`}>
				<AlertTriangle size={22} className={s.text} />
			</div>
			<div>
				<div className="flex items-center gap-3">
					<h2 className="text-xl font-bold text-neutral">Status Risiko</h2>
					<StatusBadge
						label={riskData.overallLevel.toUpperCase()}
						variant={variant}
					/>
				</div>
				<p className="text-sm text-neutral/60 mt-3 leading-relaxed max-w-xl">
					{riskData.summary}
				</p>
			</div>
		</div>
	);
}
