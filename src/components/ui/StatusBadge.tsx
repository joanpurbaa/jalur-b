import { AlertTriangle, CheckCircle2, Info, Minus, Sparkles, type LucideIcon } from "lucide-react";
import { statusStyles, statusMeta, type StatusVariant } from "../../lib/status";

interface StatusBadgeProps {
	label?: string;
	variant: StatusVariant;
	size?: "sm" | "md";
	/** Sembunyikan ikon (jarang — status tidak boleh hanya warna). */
	hideIcon?: boolean;
	onDark?: boolean;
}

const ICONS: Record<StatusVariant, LucideIcon> = {
	healthy: CheckCircle2,
	warning: Info,
	risk: AlertTriangle,
	insight: Sparkles,
	neutral: Minus,
};

/** Badge status: selalu ikon + label, bukan hanya warna. */
export default function StatusBadge({
	label,
	variant,
	size = "md",
	hideIcon = false,
	onDark = false,
}: StatusBadgeProps) {
	const s = statusStyles[variant];
	const Icon = ICONS[variant];
	const text = label ?? statusMeta[variant].label;
	const pad = size === "sm" ? "px-2 py-0.5 text-[11px] gap-1" : "px-2.5 py-1 text-xs gap-1.5";
	const tone = onDark
		? "bg-white/20 text-white border-white/30 backdrop-blur"
		: `${s.bg} ${s.text} ${s.border}`;
	return (
		<span
			className={`inline-flex items-center whitespace-nowrap font-semibold rounded-full border ${pad} ${tone}`}>
			{!hideIcon && <Icon size={size === "sm" ? 12 : 14} strokeWidth={2.4} aria-hidden />}
			{text}
		</span>
	);
}
