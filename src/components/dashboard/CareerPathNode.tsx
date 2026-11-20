import { Lock, type LucideIcon } from "lucide-react";

interface CareerPathNodeProps {
	title: string;
	subtitle?: string;
	match?: number;
	icon: LucideIcon;
	selected?: boolean;
	locked?: boolean;
	variant?: "center" | "node";
	style?: React.CSSProperties;
	onClick?: () => void;
}

export default function CareerPathNode({
	title,
	subtitle,
	match,
	icon: Icon,
	selected,
	locked = false,
	variant = "node",
	style,
	onClick,
}: CareerPathNodeProps) {
	if (variant === "center") {
		return (
			<div
				style={style}
				className="absolute -translate-x-1/2 -translate-y-1/2 z-20 w-44 rounded-2xl border border-indigo-600 bg-indigo-600 text-white shadow-md p-3.5 flex flex-col items-center text-center">
				<span className="inline-flex w-9 h-9 rounded-xl bg-white/15 items-center justify-center mb-1.5">
					<Icon size={18} strokeWidth={1.9} className="text-white" />
				</span>
				<span className="text-[11px] font-medium text-indigo-100">
					Peran Saat Ini
				</span>
				<h4 className="text-sm font-bold leading-snug mt-0.5 line-clamp-2">
					{title}
				</h4>
				{subtitle && (
					<p className="text-[11px] text-indigo-100/80 mt-0.5">{subtitle}</p>
				)}
			</div>
		);
	}

	return (
		<button
			type="button"
			onClick={onClick}
			style={style}
			className={`press absolute -translate-x-1/2 -translate-y-1/2 z-10 w-48 text-left rounded-2xl p-3 flex items-center gap-3 transition cursor-pointer ${
				selected
					? "bg-white border-2 border-indigo-600 ring-2 ring-indigo-600/15 shadow-md"
					: "bg-white hover:border-slate-300 border border-slate-200 shadow-xs"
			}`}>
			<span
				className={`inline-flex w-9 h-9 rounded-xl items-center justify-center shrink-0 border ${
					selected
						? "bg-indigo-50 text-indigo-600 border-indigo-200"
						: "bg-slate-50 text-slate-600 border-slate-200"
				}`}>
				<Icon size={17} strokeWidth={1.8} />
			</span>
			<div className="min-w-0 flex-1">
				<div className="flex items-start justify-between gap-1.5">
					<p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
						{title}
					</p>
					{locked && (
						<span
							title="Peta skill gap peran ke-2 dst. membutuhkan 5 credit"
							className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-600 shrink-0">
							<Lock size={11} strokeWidth={2.2} />
						</span>
					)}
				</div>
				{match != null && (
					<span
						className={`inline-block text-xs font-semibold mt-0.5 tabular ${
							selected ? "text-indigo-700" : "text-slate-500"
						}`}>
						{match}% cocok
					</span>
				)}
			</div>
		</button>
	);
}
