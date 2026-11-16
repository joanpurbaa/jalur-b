import {
	CheckCircle2,
	CircleDot,
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
		box: "bg-slate-100/90 border-slate-200/90 text-slate-700",
		iconColor: "text-slate-500",
	},
	insight: {
		box: "bg-indigo-50/90 border-indigo-200/80 text-indigo-800",
		iconColor: "text-indigo-600",
		defaultIcon: CircleDot,
	},
	strong: {
		box: "bg-slate-100/90 border-slate-200/90 text-slate-800",
		iconColor: "text-slate-500",
		defaultIcon: CheckCircle2,
	},
	rising: {
		box: "bg-slate-100/90 border-slate-200/90 text-slate-800",
		iconColor: "text-slate-500",
	},
	improve: {
		box: "bg-slate-100/90 border-slate-200/90 text-slate-800",
		iconColor: "text-slate-500",
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
			className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${cfg.box}`}>
			{Icon && (
				<Icon size={13} strokeWidth={1.85} className={cfg.iconColor} aria-hidden />
			)}
			{label}
		</span>
	);
}
