import { useState } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";
import {
	getHealthStatus,
	localizeLevelLabel,
} from "../../lib/status";
import IconTile from "../ui/IconTile";
import MeterBar from "../ui/MeterBar";
import StatusBadge from "../ui/StatusBadge";
import Card from "../ui/Card";
import { CountUp } from "../ui/Motion";

interface FactorCardProps {
	title: string;
	score: number;
	level?: string;
	explanation?: string;
	icon: LucideIcon;
	priorityRank?: number;
}

export default function FactorCard({
	title,
	score,
	level,
	explanation,
	icon: Icon,
	priorityRank,
}: FactorCardProps) {
	const [open, setOpen] = useState(priorityRank === 1);
	const variant = getHealthStatus(level, score);
	const displayLevel = level ? localizeLevelLabel(level) : undefined;
	const showPriorityMarker = priorityRank === 1 && variant !== "healthy";

	return (
		<Card lift padding="md" className="flex flex-col justify-between h-full">
			<div>
				<div className="flex items-start justify-between gap-3 mb-3">
					<div className="flex items-start gap-3 min-w-0">
						<IconTile icon={Icon} tone="neutral" size="sm" />
						<div className="min-w-0">
							{showPriorityMarker && (
								<span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 mb-0.5">
									<span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
									Perlu fokus lebih dulu
								</span>
							)}
							<h4 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
								{title}
							</h4>
						</div>
					</div>
					<StatusBadge
						variant={variant}
						label={displayLevel}
						size="sm"
					/>
				</div>

				<div className="flex items-baseline justify-between gap-2 mt-3 mb-2">
					<div className="flex items-baseline gap-1">
						<span className="num-display text-2xl sm:text-3xl text-slate-900">
							<CountUp value={score} />
						</span>
						<span className="text-xs font-medium text-slate-500">/100</span>
					</div>
				</div>

				<MeterBar
					value={score}
					max={100}
					status={variant}
					height="sm"
					ariaLabel={`${title} ${score} dari 100`}
				/>
			</div>

			{explanation && (
				<div className="mt-4 pt-3 border-t border-slate-100">
					<button
						type="button"
						onClick={() => setOpen((v) => !v)}
						aria-expanded={open}
						className="w-full min-h-[36px] flex items-center justify-between text-xs font-semibold text-indigo-700 hover:text-indigo-800 transition cursor-pointer">
						<span>{open ? "Tutup detail" : "Baca selengkapnya"}</span>
						<ChevronDown
							size={15}
							className={`transition-transform duration-200 ${
								open ? "rotate-180" : ""
							}`}
						/>
					</button>
					<div
						className={`grid transition-all duration-200 ease-out ${
							open
								? "grid-rows-[1fr] opacity-100 mt-2"
								: "grid-rows-[0fr] opacity-0"
						}`}>
						<div className="overflow-hidden">
							<p className="text-sm text-slate-600 leading-relaxed">
								{explanation}
							</p>
						</div>
					</div>
				</div>
			)}
		</Card>
	);
}
