import type { ReactNode } from "react";
import type { Tone } from "../../lib/modules";

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
	sm: "min-h-[38px] py-2 px-3.5 text-xs rounded-xl",
	md: "min-h-[44px] py-2.5 px-4 text-sm rounded-xl",
	lg: "min-h-[48px] py-3 px-5 text-sm sm:text-base rounded-xl",
} as const;

/** Aksi utama: indigo solid tunggal (#4F46E5), maksimal satu per area. */
export function PrimaryButton({
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
			className={`press ${fullWidth ? "w-full" : ""} ${SIZE[size]} bg-indigo-600 text-white font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
				disabled
					? "opacity-45 cursor-not-allowed"
					: "hover:bg-indigo-700"
			} ${className}`}>
			{icon}
			{children}
		</button>
	);
}

/** Aksi sekunder: outline netral. */
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
			className={`press ${fullWidth ? "w-full" : ""} ${SIZE[size]} border border-slate-200 text-slate-700 bg-white font-semibold hover:bg-slate-50 hover:border-slate-300 shadow-2xs flex items-center justify-center gap-2 cursor-pointer ${
				disabled ? "opacity-45 cursor-not-allowed" : ""
			} ${className}`}>
			{icon}
			{children}
		</button>
	);
}

/** Aksi tersier: teks / ghost button. */
export function GhostButton({
	children,
	icon,
	onClick,
	fullWidth,
	disabled,
	size = "sm",
	type = "button",
	className = "",
}: ButtonProps) {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`press ${fullWidth ? "w-full" : ""} ${SIZE[size]} text-indigo-700 font-semibold hover:bg-indigo-50 flex items-center justify-center gap-1.5 cursor-pointer ${
				disabled ? "opacity-45 cursor-not-allowed" : ""
			} ${className}`}>
			{icon}
			{children}
		</button>
	);
}
