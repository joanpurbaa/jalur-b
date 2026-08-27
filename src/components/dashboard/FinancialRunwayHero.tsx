import { Sparkles } from "lucide-react";
import { financialData } from "../../data/dashboardDummyData";
import { getScoreStatus, statusStyles } from "../../lib/status";
import ProgressBar from "../ui/ProgressBar";

export default function FinancialRunwayHero() {
	const percentToTarget = Math.min(
		100,
		Math.round((financialData.currentRunway / financialData.targetRunway) * 100),
	);
	const variant = getScoreStatus(percentToTarget);
	const s = statusStyles[variant];
	const gap = (financialData.targetRunway - financialData.currentRunway).toFixed(
		1,
	);

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-stretch">
			<div className="lg:col-span-2 bg-primary/5 rounded-2xl border border-primary/20 border-l-4 border-l-primary shadow-sm p-8">
				<div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-5">
					<Sparkles size={13} />
					<span>AI Insight</span>
				</div>
				<div className="flex items-baseline gap-2">
					<span className="text-5xl font-extrabold text-neutral">
						{financialData.currentRunway.toString().replace(".", ",")}
					</span>
					<span className="text-base text-neutral/50 font-medium">bulan</span>
				</div>
				<p className="text-sm text-neutral/60 mt-4 leading-relaxed max-w-lg">
					{financialData.description}
				</p>
			</div>

			<div
				className={`rounded-2xl border shadow-sm p-6 flex flex-col justify-center ${s.bg} ${s.border}`}>
				<div className="flex items-center justify-between mb-2">
					<div>
						<p className="text-[11px] text-neutral/50 font-medium uppercase tracking-wide">
							Kondisi Saat Ini
						</p>
						<p className="text-lg font-bold text-neutral mt-0.5">
							{financialData.currentRunway.toFixed(1)} bln
						</p>
					</div>
					<div className="text-right">
						<p className="text-[11px] text-neutral/50 font-medium uppercase tracking-wide">
							Target Minimum
						</p>
						<p className="text-lg font-bold text-neutral mt-0.5">
							{financialData.targetRunway.toFixed(1)} bln
						</p>
					</div>
				</div>
				<div className="my-3">
					<ProgressBar value={percentToTarget} variant={variant} />
				</div>
				<p className={`text-xs font-semibold ${statusStyles.risk.text}`}>
					↓ Gap: {gap} bulan
				</p>
			</div>
		</div>
	);
}
