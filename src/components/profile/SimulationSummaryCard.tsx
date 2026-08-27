import { Wallet, HeartPulse, Zap, Compass } from "lucide-react";
import { simulationData } from "../../data/dashboardDummyData";
import { getScoreStatus } from "../../lib/status";
import MetricCard from "../dashboard/MetricCard";

const readinessIcons = { Wallet, HeartPulse, Zap, Compass };

interface SimulationSummaryCardProps {
	onSeeMore: () => void;
}

export default function SimulationSummaryCard({
	onSeeMore,
}: SimulationSummaryCardProps) {
	return (
		<div>
			<p className="text-xs text-neutral/50 mb-5 leading-relaxed">
				Simulasi menggunakan kondisi karier, skill, bukti karier, dan kondisi
				finansialmu untuk memproyeksikan skenario kehilangan pekerjaan.
			</p>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
				{simulationData.result.readiness.map((item) => (
					<MetricCard
						key={item.label}
						label={item.label}
						value={`${item.value}/100`}
						icon={readinessIcons[item.icon as keyof typeof readinessIcons]}
						variant={getScoreStatus(item.value)}
					/>
				))}
			</div>

			<button
				type="button"
				onClick={onSeeMore}
				className="text-xs font-semibold text-primary hover:opacity-70 transition">
				Lihat Simulasi →
			</button>
		</div>
	);
}
