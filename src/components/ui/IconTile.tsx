import type { LucideIcon } from "lucide-react";
import { toneStyles, type Tone } from "../../lib/modules";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE: Record<
	Size,
	{ box: string; icon: number; radius: string; stroke: number }
> = {
	xs: { box: "w-7 h-7", icon: 15, radius: "rounded-lg", stroke: 1.8 },
	sm: { box: "w-9 h-9", icon: 17, radius: "rounded-xl", stroke: 1.8 },
	md: { box: "w-10 h-10", icon: 19, radius: "rounded-xl", stroke: 1.75 },
	lg: { box: "w-12 h-12", icon: 22, radius: "rounded-2xl", stroke: 1.75 },
	xl: { box: "w-14 h-14", icon: 26, radius: "rounded-2xl", stroke: 1.75 },
};

interface IconTileProps {
	icon: LucideIcon;
	tone?: Tone;
	size?: Size;
	className?: string;
	flat?: boolean;
	label?: string;
}

/**
 * IconTile — kontainer ikon datar seragam (indigo-50/slate-100, border tipis,
 * outline stroke konsisten). Tidak menggunakan gloss maupun gradien dekoratif.
 */
export default function IconTile({
	icon: Icon,
	tone = "neutral",
	size = "md",
	className = "",
	label,
}: IconTileProps) {
	const t = toneStyles(tone);
	const s = SIZE[size];

	return (
		<span
			role={label ? "img" : undefined}
			aria-label={label}
			aria-hidden={label ? undefined : true}
			className={`inline-flex shrink-0 items-center justify-center ${s.box} ${s.radius} ${t.gradient} ${className}`}>
			<Icon size={s.icon} strokeWidth={s.stroke} />
		</span>
	);
}
