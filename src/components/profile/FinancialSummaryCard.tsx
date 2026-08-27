import { Lock } from "lucide-react";
import { financialData } from "../../data/dashboardDummyData";
import { getScoreStatus, statusStyles } from "../../lib/status";
import ProgressBar from "../ui/ProgressBar";
import { SecondaryButton } from "../ui/PrimaryButton";

interface FinancialSummaryCardProps {
	onEdit: () => void;
}

export default function FinancialSummaryCard({
	onEdit,
}: FinancialSummaryCardProps) {
	const percentToTarget = Math.min(
		100,
		Math.round((financialData.currentRunway / financialData.targetRunway) * 100),
	);
	const variant = getScoreStatus(percentToTarget);
	const s = statusStyles[variant];

	return (
		<div>
			<div className={`rounded-xl p-5 mb-5 ${s.bg} border ${s.border}`}>
				<div className="flex items-center justify-between mb-2">
					<div>
						<p className="text-[11px] font-medium text-neutral/50 uppercase tracking-wide">
							Current Runway
						</p>
						<p className="text-2xl font-extrabold text-neutral mt-0.5">
							{financialData.currentRunway.toFixed(1)} bulan
						</p>
					</div>
					<div className="text-right">
						<p className="text-[11px] font-medium text-neutral/50 uppercase tracking-wide">
							Target
						</p>
						<p className="text-sm font-bold text-neutral mt-0.5">
							{financialData.targetRunway.toFixed(1)} bulan
						</p>
					</div>
				</div>
				<ProgressBar value={percentToTarget} variant={variant} />
			</div>

			<div className="divide-y divide-neutral/10 border-t border-neutral/10 mb-4">
				{financialData.parameters.map((item) => (
					<div key={item.id} className="flex items-center justify-between py-2.5">
						<span className="text-sm text-neutral/60">{item.label}</span>
						<span className="text-sm font-semibold text-neutral">{item.value}</span>
					</div>
				))}
			</div>

			<div className="flex items-center gap-2 mb-5">
				<Lock size={12} className="text-neutral/40" />
				<p className="text-xs text-neutral/50">
					Data finansialmu bersifat privat dan hanya digunakan untuk menghitung
					financial runway.
				</p>
			</div>

			<SecondaryButton onClick={onEdit}>Edit Data Finansial</SecondaryButton>
		</div>
	);
}
