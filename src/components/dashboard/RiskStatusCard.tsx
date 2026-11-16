import { getLevelStatus, type RiskLevel } from "../../lib/status";
import StatusBadge from "../ui/StatusBadge";
import HalfGauge from "../ui/HalfGauge";
import Card from "../ui/Card";

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
			padding="lg"
			className="mb-6 bg-gradient-to-br from-white via-amber-50/40 to-orange-50/30 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
			<div className="shrink-0 flex flex-col items-center">
				<HalfGauge
					value={score ?? null}
					max={100}
					width={220}
					stroke={16}
					label="Skor Risiko Karier"
					suffix="Skor Risiko / 100"
				/>
			</div>

			<div className="flex-1 min-w-0 text-center md:text-left">
				<div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-2">
					<span className="text-xs font-extrabold uppercase tracking-wider text-amber-700">
						Status Risiko Saat Ini
					</span>
					<StatusBadge label={`Risiko ${level}`} variant={variant} />
				</div>
				<h2 className="text-xl sm:text-2xl font-extrabold text-neutral">
					{level === "Rendah"
						? "Peranmu tergolong tangguh terhadap guncangan pasar"
						: level === "Sedang"
							? "Waspada tenang: ada sinyal pergeseran yang bisa kamu antisipasi"
							: "Saatnya memperkuat rencana cadangan dan bukti keahlianmu"}
				</h2>
				<p className="text-sm sm:text-[15px] text-neutral/75 mt-2.5 leading-relaxed">
					{summary}
				</p>
			</div>
		</Card>
	);
}
