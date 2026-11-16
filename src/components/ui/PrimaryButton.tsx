import type { ReactNode } from "react";
import { toneStyles, type Tone } from "../../lib/modules";

interface ButtonProps {
	children: ReactNode;
	icon?: ReactNode;
	onClick?: () => void;
	fullWidth?: boolean;
	disabled?: boolean;
	tone?: Tone;
	size?: "sm" | "md" | "lg";
	type?: "button" | "submit";
	className?: string;
}

const SIZE = {
	sm: "py-2 px-3.5 text-xs rounded-xl",
	md: "py-2.5 px-4 text-sm rounded-xl",
	lg: "py-3.5 px-6 text-sm sm:text-base rounded-2xl",
} as const;

export function PrimaryButton({
	children,
	icon,
	onClick,
	fullWidth,
	disabled,
	tone = "beranda",
	size = "md",
	type = "button",
	className = "",
}: ButtonProps) {
	const t = toneStyles(tone);
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			style={
				disabled
					? undefined
					: {
							boxShadow: `inset 0 1px 0 rgba(255,255,255,0.35), 0 6px 16px -4px ${t.shadow}`,
						}
			}
			className={`press ${fullWidth ? "w-full" : ""} ${SIZE[size]} ${t.gradient} text-white font-semibold flex items-center justify-center gap-2 cursor-pointer ${
				disabled ? "opacity-45 cursor-not-allowed" : "hover:brightness-105"
			} ${className}`}>
			{icon}
			{children}
		</button>
	);
}

export function SecondaryButton({
	children,
	icon,
	onClick,
	fullWidth,
	disabled,
	size = "md",
	type = "button",
	className = "",
}: ButtonProps) {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`press ${fullWidth ? "w-full" : ""} ${SIZE[size]} border border-slate-200/90 text-neutral bg-white/90 font-semibold hover:bg-slate-50 hover:border-indigo-200 shadow-[0_2px_6px_rgba(15,23,42,0.05)] flex items-center justify-center gap-2 cursor-pointer ${
				disabled ? "opacity-45 cursor-not-allowed" : ""
			} ${className}`}>
			{icon}
			{children}
		</button>
	);
}
