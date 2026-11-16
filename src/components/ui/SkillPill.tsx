import {
	CheckCircle2,
	Sparkles,
	TrendingUp,
	Wrench,
	type LucideIcon,
} from "lucide-react";

export type SkillPillTone =
	| "neutral"
	| "insight"
	| "strong"
	| "rising"
	| "improve";

interface SkillPillProps {
	label: string;
	icon?: LucideIcon;
	tone?: SkillPillTone;
}

const TONE_MAP: Record<
	SkillPillTone,
	{ box: string; iconColor: string; defaultIcon?: LucideIcon }
> = {
	neutral: {
		box: "bg-slate-100/90 border-slate-200/90 text-slate-800",
		iconColor: "text-slate-500",
	},
	insight: {
		box: "bg-violet-50 border-violet-200 text-violet-800",
		iconColor: "text-violet-600",
		defaultIcon: Sparkles,
	},
	strong: {
		box: "bg-emerald-50 border-emerald-200 text-emerald-900",
		iconColor: "text-emerald-600",
		defaultIcon: CheckCircle2,
	},
	rising: {
		box: "bg-cyan-50 border-cyan-200 text-cyan-900",
		iconColor: "text-cyan-600",
		defaultIcon: TrendingUp,
	},
	improve: {
		box: "bg-amber-50 border-amber-200 text-amber-900",
		iconColor: "text-amber-600",
		defaultIcon: Wrench,
	},
};

export default function SkillPill({
	label,
	icon,
	tone = "neutral",
}: SkillPillProps) {
	const cfg = TONE_MAP[tone];
	const Icon = icon ?? cfg.defaultIcon;

	return (
		<span
			className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-2xs ${cfg.box}`}>
			{Icon && <Icon size={13} strokeWidth={2.3} className={cfg.iconColor} />}
			{label}
		</span>
	);
}
