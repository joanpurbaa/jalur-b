import { riskData } from "../../data/dashboardDummyData";
import { getLevelStatus, statusStyles, type RiskLevel } from "../../lib/status";
import StatusBadge from "../ui/StatusBadge";

interface RiskSummaryCardProps {
	onSeeMore: () => void;
}

export default function RiskSummaryCard({ onSeeMore }: RiskSummaryCardProps) {
	const overallVariant = getLevelStatus(riskData.overallLevel as RiskLevel);

	return (
		<div>
			<div className="flex items-center gap-3 mb-4">
				<StatusBadge label={riskData.overallLevel} variant={overallVariant} />
				<p className="text-xs text-neutral/50 leading-relaxed">
					{riskData.summary}
				</p>
			</div>

			<div className="divide-y divide-neutral/10 border-t border-neutral/10">
				{riskData.dimensions.map((item) => {
					const variant = getLevelStatus(item.level);
					const s = statusStyles[variant];
					return (
						<div key={item.title} className="flex items-center justify-between py-3">
							<span className="text-sm text-neutral/70">{item.title}</span>
							<span className={`text-sm font-semibold ${s.text}`}>{item.level}</span>
						</div>
					);
				})}
			</div>

			<button
				type="button"
				onClick={onSeeMore}
				className="text-xs font-semibold text-primary hover:opacity-70 transition mt-4">
				Lihat Analisis Risiko →
			</button>
		</div>
	);
}
