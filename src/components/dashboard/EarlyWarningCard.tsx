import { AlertTriangle } from "lucide-react";
import { riskData } from "../../data/dashboardDummyData";
import { SecondaryButton } from "../ui/PrimaryButton";

export default function EarlyWarningCard() {
	return (
		<div className="bg-white rounded-2xl p-6 border border-neutral/5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
			<div className="flex items-start gap-4">
				<div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
					<AlertTriangle size={18} className="text-rose-600" />
				</div>
				<div>
					<p className="text-xs font-semibold text-neutral/50 uppercase tracking-wider mb-1">
						Early Warning
					</p>
					<h4 className="text-sm font-bold text-neutral mb-1">
						{riskData.earlyWarning.title}
					</h4>
					<p className="text-xs text-neutral/60 leading-relaxed max-w-xl">
						{riskData.earlyWarning.description}
					</p>
				</div>
			</div>
			<SecondaryButton>{riskData.earlyWarning.ctaLabel}</SecondaryButton>
		</div>
	);
}
