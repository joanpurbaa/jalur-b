import { getLevelStatus, type RiskLevel } from "../../lib/status";
import StatusBadge from "../ui/StatusBadge";
import HalfGauge from "../ui/HalfGauge";
import Card from "../ui/Card";
import ExpandableText from "../ui/ExpandableText";

interface RiskStatusCardProps {
	level: RiskLevel;
	summary: string;
	score?: number;
}

export default function RiskStatusCard({
	level,
	summary,
	score,
}: RiskStatusCardProps) {
	const variant = getLevelStatus(level);

	return (
		<Card
			variant="hero"
			padding="lg"
			className="mb-6 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
			<div className="shrink-0 flex flex-col items-center">
				<HalfGauge
					value={score ?? null}
					max={100}
					width={220}
					stroke={15}
					label="Skor Risiko Karier"
					suffix="Skor Risiko / 100"
				/>
			</div>

			<div className="flex-1 min-w-0 text-center md:text-left">
				<div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-2">
					<span className="text-xs font-semibold text-slate-600">
						Status Risiko Saat Ini
					</span>
					<StatusBadge label={`Risiko ${level}`} variant={variant} />
				</div>
				<h2 className="text-xl font-bold text-slate-900">
					{level === "Rendah"
						? "Peranmu tergolong tangguh terhadap guncangan pasar"
						: level === "Sedang"
							? "Ada sinyal pergeseran yang bisa kamu antisipasi sejak dini"
							: "Saatnya memperkuat rencana cadangan dan portofolio skill"}
				</h2>
				<ExpandableText
					text={summary}
					maxLines={3}
					className="text-sm text-slate-600 mt-2.5 leading-relaxed"
				/>
			</div>
		</Card>
	);
}
