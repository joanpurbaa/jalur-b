import type { LucideIcon } from "lucide-react";
import { getLevelStatus, type RiskLevel } from "../../lib/status";
import StatusBadge from "../ui/StatusBadge";
import IconTile from "../ui/IconTile";
import Card from "../ui/Card";

interface RiskDimensionCardProps {
	title: string;
	description: string;
	level: RiskLevel;
	score?: number;
	icon: LucideIcon;
}

const LEVELS: RiskLevel[] = ["Rendah", "Sedang", "Tinggi"];

export default function RiskDimensionCard({
	title,
	description,
	level,
	score,
	icon: Icon,
}: RiskDimensionCardProps) {
	const variant = getLevelStatus(level);
	const activeCount = level === "Rendah" ? 1 : level === "Sedang" ? 2 : 3;
	const tone =
		variant === "healthy"
			? "safe"
			: variant === "warning"
				? "caution"
				: "danger";

	const activeBarClass =
		variant === "healthy"
			? "bg-emerald-500 shadow-[0_2px_8px_rgba(16,185,129,0.45)]"
			: variant === "warning"
				? "bg-amber-500 shadow-[0_2px_8px_rgba(245,158,11,0.45)]"
				: "bg-rose-500 shadow-[0_2px_8px_rgba(244,63,94,0.45)]";

	return (
		<Card lift padding="md" className="flex flex-col justify-between h-full">
			<div>
				<div className="flex items-start justify-between gap-3 mb-4">
					<div className="flex items-center gap-3 min-w-0">
						<IconTile icon={Icon} tone={tone} size="sm" />
						<h4 className="text-sm sm:text-base font-extrabold text-neutral leading-snug">
							{title}
						</h4>
					</div>
					<StatusBadge
						label={score != null ? `${level} · ${score}` : level}
						variant={variant}
						size="sm"
					/>
				</div>

				{/* Meter 3 level berwarna */}
				<div
					role="meter"
					aria-label={`Tingkat risiko ${title}: ${level}`}
					aria-valuemin={1}
					aria-valuemax={3}
					aria-valuenow={activeCount}
					className="mb-3">
					<div className="grid grid-cols-3 gap-2">
						{LEVELS.map((lvl, idx) => {
							const filled = idx + 1 <= activeCount;
							return (
								<div key={lvl} className="space-y-1">
									<div
										className={`h-2.5 rounded-full transition-all ${
											filled ? activeBarClass : "bg-slate-900/[0.07]"
										}`}
									/>
									<span
										className={`block text-[10px] font-bold text-center ${
											lvl === level ? "text-neutral" : "text-neutral/40"
										}`}>
										{lvl}
									</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			<p className="text-xs sm:text-sm text-neutral/70 leading-relaxed pt-2 border-t border-slate-100">
				{description}
			</p>
		</Card>
	);
}
