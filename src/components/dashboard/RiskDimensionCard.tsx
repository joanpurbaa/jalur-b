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

	const activeBarClass =
		variant === "healthy"
			? "bg-emerald-500"
			: variant === "warning"
				? "bg-amber-500"
				: "bg-rose-500";

	return (
		<Card lift padding="md" className="flex flex-col justify-between h-full">
			<div>
				<div className="flex items-start justify-between gap-3 mb-4">
					<div className="flex items-start gap-3 min-w-0">
						<IconTile icon={Icon} tone="neutral" size="sm" />
						<h4 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
							{title}
						</h4>
					</div>
					<StatusBadge
						label={score != null ? `${level} · ${score}` : level}
						variant={variant}
						size="sm"
					/>
				</div>

				{/* Meter 3 level dengan status muted */}
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
										className={`h-2 rounded-full transition-colors ${
											filled ? activeBarClass : "bg-slate-200/80"
										}`}
									/>
									<span
										className={`block text-[11px] font-medium text-center ${
											lvl === level ? "text-slate-900 font-semibold" : "text-slate-500"
										}`}>
										{lvl}
									</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			<p className="text-sm text-slate-600 leading-relaxed pt-3 border-t border-slate-100">
				{description}
			</p>
		</Card>
	);
}
