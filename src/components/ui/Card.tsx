import type { HTMLAttributes, ReactNode } from "react";
import { Tilt } from "./Motion";

type Pad = "none" | "sm" | "md" | "lg";
const PAD: Record<Pad, string> = {
	none: "",
	sm: "p-4",
	md: "p-5 sm:p-6",
	lg: "p-6 sm:p-8",
};

interface CardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	padding?: Pad;
	/** Naik sedikit saat hover. */
	lift?: boolean;
	/** Tilt 3D ringan (kartu utama saja). */
	tilt?: boolean;
	className?: string;
}

/**
 * Kartu dasar berlapis: shadow bertingkat, inner highlight,
 * border gradien tipis, radius besar.
 */
export default function Card({
	children,
	padding = "md",
	lift = false,
	tilt = false,
	className = "",
	...rest
}: CardProps) {
	const cls = `card-3d ${lift ? "card-lift" : ""} ${PAD[padding]} ${className}`;
	if (tilt) {
		return (
			<Tilt className={cls} {...rest}>
				{children}
			</Tilt>
		);
	}
	return (
		<div className={cls} {...rest}>
			{children}
		</div>
	);
}
