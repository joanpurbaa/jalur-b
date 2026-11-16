import type { LucideIcon } from "lucide-react";
import { toneStyles, type Tone } from "../../lib/modules";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE: Record<Size, { box: string; icon: number; radius: string; stroke: number }> = {
	xs: { box: "w-7 h-7", icon: 14, radius: "rounded-[9px]", stroke: 2.4 },
	sm: { box: "w-9 h-9", icon: 17, radius: "rounded-[11px]", stroke: 2.4 },
	md: { box: "w-11 h-11", icon: 20, radius: "rounded-[14px]", stroke: 2.3 },
	lg: { box: "w-14 h-14", icon: 26, radius: "rounded-[18px]", stroke: 2.2 },
	xl: { box: "w-20 h-20", icon: 36, radius: "rounded-[26px]", stroke: 2 },
};

interface IconTileProps {
	icon: LucideIcon;
	tone?: Tone;
	size?: Size;
	className?: string;
	/** Versi datar (tanpa bayangan) untuk tempat sempit/aktif. */
	flat?: boolean;
	label?: string;
}

/**
 * IconTile — squircle claymorphism: gradien berwarna, highlight di atas,
 * bayangan berwarna di bawah, ikon putih tebal.
 */
export default function IconTile({
	icon: Icon,
	tone = "beranda",
	size = "md",
	className = "",
	flat = false,
	label,
}: IconTileProps) {
	const t = toneStyles(tone);
	const s = SIZE[size];
	return (
		<span
			role={label ? "img" : undefined}
			aria-label={label}
			aria-hidden={label ? undefined : true}
			className={`relative inline-flex shrink-0 items-center justify-center ${s.box} ${s.radius} ${t.gradient} ${className}`}
			style={
				flat
					? undefined
					: {
							boxShadow: `inset 0 2px 1px rgba(255,255,255,0.45), inset 0 -3px 6px rgba(0,0,0,0.12), 0 6px 14px -4px ${t.shadow}`,
						}
			}>
			{/* highlight atas */}
			<span
				aria-hidden
				className={`pointer-events-none absolute inset-x-[14%] top-[6%] h-[38%] ${s.radius} bg-gradient-to-b from-white/45 to-white/0`}
			/>
			<Icon
				size={s.icon}
				strokeWidth={s.stroke}
				className="relative text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.18)]"
			/>
		</span>
	);
}
