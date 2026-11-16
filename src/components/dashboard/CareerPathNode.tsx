import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import IconTile from "../ui/IconTile";
import { getScoreStatus } from "../../lib/status";

interface CareerPathNodeProps {
	title: string;
	subtitle?: string;
	match?: number;
	icon: LucideIcon;
	selected?: boolean;
	variant?: "center" | "node";
	float?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

export default function CareerPathNode({
	title,
	subtitle,
	match,
	icon: Icon,
	selected,
	variant = "node",
	float,
	style,
	onClick,
}: CareerPathNodeProps) {
	if (variant === "center") {
		return (
			<div
				style={style}
				className="absolute -translate-x-1/2 -translate-y-1/2 z-20 w-48 rounded-3xl border-2 border-emerald-500/90 bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-[0_20px_40px_-14px_rgba(16,185,129,0.55)] p-4 flex flex-col items-center text-center">
				<span className="inline-flex w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs items-center justify-center mb-2 shadow-inner">
					<Icon size={22} className="text-white" />
				</span>
				<span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">
					Peran Saat Ini
				</span>
				<h4 className="text-sm font-extrabold leading-tight mt-0.5 line-clamp-2">
					{title}
				</h4>
				{subtitle && (
					<p className="text-[11px] text-emerald-100/80 mt-0.5">{subtitle}</p>
				)}
			</div>
		);
	}

	const status = match != null ? getScoreStatus(match) : "insight";
	const tone =
		status === "healthy"
			? "jalur-karier"
			: status === "warning"
				? "caution"
				: "indigo";

	return (
		<button
			type="button"
			onClick={onClick}
			style={style}
			className={`press absolute -translate-x-1/2 -translate-y-1/2 z-10 w-52 text-left rounded-2xl p-3.5 flex items-center gap-3 transition cursor-pointer ${
				selected
					? "bg-white ring-3 ring-emerald-500 border border-emerald-300 shadow-[0_18px_36px_-12px_rgba(16,185,129,0.42)] scale-[1.03]"
					: "bg-white/95 hover:bg-white border border-slate-200/90 shadow-[0_10px_24px_-12px_rgba(15,23,42,0.18)]"
			} ${float || ""} motion-reduce:animate-none`}>
			<IconTile icon={Icon} tone={tone} size="sm" />
			<div className="min-w-0 flex-1">
				<p className="text-xs sm:text-sm font-extrabold text-neutral leading-snug line-clamp-2">
					{title}
				</p>
				{match != null && (
					<span
						className={`inline-block text-xs font-extrabold mt-0.5 tabular ${
							selected ? "text-emerald-700" : "text-neutral/60"
						}`}>
						{match}% cocok
					</span>
				)}
			</div>
			{selected && (
				<span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center shadow-md motion-safe:animate-pulse-soft">
					<Sparkles size={12} className="text-white" />
				</span>
			)}
		</button>
	);
}
