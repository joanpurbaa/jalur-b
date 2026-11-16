import {
	Award,
	BookOpen,
	FolderKanban,
	Layers,
	Medal,
	MessageSquareQuote,
	Sparkles,
	Trophy,
	type LucideIcon,
} from "lucide-react";

interface FilterTabsProps {
	options: string[];
	active: string;
	onChange: (value: string) => void;
	counts?: Record<string, number>;
}

const OPTION_STYLE: Record<
	string,
	{ icon: LucideIcon; activeClass: string; iconColor: string }
> = {
	Semua: {
		icon: Layers,
		activeClass: "bg-sky-600 text-white border-sky-600 shadow-sky-500/25",
		iconColor: "text-sky-600",
	},
	Project: {
		icon: FolderKanban,
		activeClass: "bg-indigo-600 text-white border-indigo-600 shadow-indigo-500/25",
		iconColor: "text-indigo-600",
	},
	Achievement: {
		icon: Trophy,
		activeClass: "bg-emerald-600 text-white border-emerald-600 shadow-emerald-500/25",
		iconColor: "text-emerald-600",
	},
	Feedback: {
		icon: MessageSquareQuote,
		activeClass: "bg-violet-600 text-white border-violet-600 shadow-violet-500/25",
		iconColor: "text-violet-600",
	},
	Certificate: {
		icon: Medal,
		activeClass: "bg-cyan-600 text-white border-cyan-600 shadow-cyan-500/25",
		iconColor: "text-cyan-600",
	},
	Award: {
		icon: Award,
		activeClass: "bg-amber-500 text-white border-amber-500 shadow-amber-500/25",
		iconColor: "text-amber-600",
	},
	Training: {
		icon: BookOpen,
		activeClass: "bg-teal-600 text-white border-teal-600 shadow-teal-500/25",
		iconColor: "text-teal-600",
	},
	Other: {
		icon: Sparkles,
		activeClass: "bg-slate-700 text-white border-slate-700 shadow-slate-500/25",
		iconColor: "text-slate-600",
	},
};

export default function FilterTabs({
	options,
	active,
	onChange,
	counts,
}: FilterTabsProps) {
	return (
		<div
			role="tablist"
			aria-label="Filter jenis bukti karier"
			className="flex flex-wrap gap-2 mb-6">
			{options.map((option) => {
				const isActive = active === option;
				const cfg = OPTION_STYLE[option] ?? OPTION_STYLE.Other;
				const Icon = cfg.icon;
				const count = counts?.[option];

				return (
					<button
						key={option}
						type="button"
						role="tab"
						aria-selected={isActive}
						onClick={() => onChange(option)}
						className={`press inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-2xl border transition cursor-pointer ${
							isActive
								? `${cfg.activeClass} shadow-md`
								: "bg-white/90 text-neutral/75 border-slate-200/90 hover:bg-white hover:border-sky-200"
						}`}>
						<Icon
							size={14}
							strokeWidth={2.3}
							className={isActive ? "text-white" : cfg.iconColor}
						/>
						<span>{option}</span>
						{count != null && (
							<span
								className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold tabular ${
									isActive
										? "bg-white/25 text-white"
										: "bg-slate-100 text-neutral/60"
								}`}>
								{count}
							</span>
						)}
					</button>
				);
			})}
		</div>
	);
}
