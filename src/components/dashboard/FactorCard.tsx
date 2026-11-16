import { useState } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { getScoreStatus } from "../../lib/status";
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
	const variant = getScoreStatus(score);
	const tone =
		variant === "healthy"
			? "safe"
			: variant === "warning"
				? "caution"
				: "danger";

	return (
		<Card lift padding="md" className="flex flex-col justify-between h-full">
			<div>
				<div className="flex items-start justify-between gap-3 mb-3">
					<div className="flex items-center gap-3 min-w-0">
						<IconTile icon={Icon} tone={tone} size="sm" />
						<div className="min-w-0">
							{priorityRank === 1 && score < 75 && (
								<span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-rose-600 mb-0.5">
									Prioritas Utama
								</span>
							)}
							<h4 className="text-sm sm:text-base font-extrabold text-neutral truncate">
								{title}
							</h4>
						</div>
					</div>
					<StatusBadge
						variant={variant}
						label={
							level ||
							(variant === "healthy"
								? "Kuat"
								: variant === "warning"
									? "Cukup"
									: "Fokus")
						}
						size="sm"
					/>
				</div>

				<div className="flex items-baseline justify-between gap-2 mt-2 mb-2">
					<div className="flex items-baseline gap-1">
						<span className="num-display text-3xl text-neutral">
							<CountUp value={score} />
						</span>
						<span className="text-xs font-semibold text-neutral/45">/100</span>
					</div>
					<span className="text-xs text-neutral/55 font-medium">
						{score >= 75
							? "Pertahankan ritme"
							: score >= 60
								? "Ruang penguatan"
								: "Area untuk ditingkatkan"}
					</span>
				</div>

				<MeterBar
					value={score}
					max={100}
					status={variant}
					height="md"
					ariaLabel={`${title} ${score} dari 100`}
				/>
			</div>

			{explanation && (
				<div className="mt-4 pt-3 border-t border-slate-100">
					<button
						type="button"
						onClick={() => setOpen((v) => !v)}
						aria-expanded={open}
						className="w-full flex items-center justify-between text-xs font-bold text-rose-700 hover:text-rose-800 transition cursor-pointer">
						<span>{open ? "Sembunyikan detail" : "Lihat selengkapnya"}</span>
						<ChevronDown
							size={15}
							className={`transition-transform duration-200 ${
								open ? "rotate-180" : ""
							}`}
						/>
					</button>
					<div
						className={`grid transition-all duration-250 ease-out ${
							open
								? "grid-rows-[1fr] opacity-100 mt-2.5"
								: "grid-rows-[0fr] opacity-0"
						}`}>
						<div className="overflow-hidden">
							<p className="text-xs sm:text-sm text-neutral/70 leading-relaxed">
								{explanation}
							</p>
						</div>
					</div>
				</div>
			)}
		</Card>
	);
}
