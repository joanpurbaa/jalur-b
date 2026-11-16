import type { HTMLAttributes, ReactNode } from "react";

type Pad = "none" | "sm" | "md" | "lg";
const PAD: Record<Pad, string> = {
	none: "",
	sm: "p-4",
	md: "p-5 sm:p-6",
	lg: "p-6 sm:p-7",
};

interface CardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	padding?: Pad;
	variant?: "default" | "hero";
	lift?: boolean;
	tilt?: boolean;
	className?: string;
}

/**
 * Kartu standar: permukaan bersih, border 1px slate-200, shadow halus.
 * Varian "hero" memakai tint indigo-50 yang sangat samar.
 */
export default function Card({
	children,
	padding = "md",
	variant = "default",
	lift = false,
	className = "",
	...rest
}: CardProps) {
	const base = variant === "hero" ? "card-hero" : "card-surface";
	return (
		<div
			className={`${base} ${lift ? "card-hover" : ""} ${PAD[padding]} ${className}`}
			{...rest}>
			{children}
		</div>
	);
}
