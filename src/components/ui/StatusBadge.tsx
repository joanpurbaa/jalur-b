import {
	AlertTriangle,
	CheckCircle2,
	Info,
	Minus,
	type LucideIcon,
} from "lucide-react";
import { statusStyles, statusMeta, type StatusVariant } from "../../lib/status";

interface StatusBadgeProps {
	label?: string;
	variant: StatusVariant;
	size?: "sm" | "md";
	hideIcon?: boolean;
	onDark?: boolean;
}

const ICONS: Record<StatusVariant, LucideIcon> = {
	healthy: CheckCircle2,
	warning: Info,
	risk: AlertTriangle,
	insight: Info,
	neutral: Minus,
};

/**
 * Badge status tunggal dengan titik warna + teks jelas (tint muted).
 * Selalu memiliki label dan indikator non-warna agar ramah aksesibilitas.
 */
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
	const pad =
		size === "sm"
			? "px-2.5 py-0.5 text-xs gap-1.5"
			: "px-3 py-1 text-xs gap-1.5";
	const tone = onDark
		? "bg-white/20 text-white border-white/30"
		: `${s.bg} ${s.text} ${s.border}`;

	return (
		<span
			className={`inline-flex items-center whitespace-nowrap font-semibold rounded-full border ${pad} ${tone}`}>
			{!hideIcon && (
				<Icon size={size === "sm" ? 12 : 13} strokeWidth={2} aria-hidden />
			)}
			<span>{text}</span>
		</span>
	);
}
