import type { LucideIcon } from "lucide-react";
import { getScoreStatus, statusStyles } from "../../lib/status";
import ProgressBar from "../ui/ProgressBar";

interface FactorCardProps {
	title: string;
	score: number;
	icon: LucideIcon;
}

export default function FactorCard({
	title,
	score,
	icon: Icon,
}: FactorCardProps) {
	const variant = getScoreStatus(score);
	const s = statusStyles[variant];

	return (
		<div className="bg-white rounded-2xl p-5 border border-neutral/5 shadow-sm flex flex-col justify-between h-32">
			<div className="flex justify-between items-center">
				<span className="text-xs font-semibold text-neutral">{title}</span>
				<div
					className={`w-7 h-7 rounded-lg flex items-center justify-center ${s.iconBg}`}>
					<Icon size={14} className={s.text} />
				</div>
			</div>
			<div>
				<span className={`text-2xl font-bold ${s.text}`}>{score}</span>
				<div className="mt-2">
					<ProgressBar value={score} variant={variant} />
				</div>
			</div>
		</div>
	);
}
