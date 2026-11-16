import type { CSSProperties, ReactNode } from "react";
import { motion, type Variants } from "motion/react";
import { DUR, EASE_OUT, fadeUp, staggerParent, useCountUp } from "../../lib/motion";

export function SectionReveal({
	children,
	className,
	delay = 0,
	as = "div",
}: {
	children: ReactNode;
	className?: string;
	delay?: number;
	as?: "div" | "section";
}) {
	const Comp = as === "section" ? motion.section : motion.div;
	return (
		<Comp
			className={className}
			initial={{ opacity: 0, y: 12 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-40px" }}
			transition={{ duration: Math.min(DUR.base, 0.28), ease: EASE_OUT, delay }}>
			{children}
		</Comp>
	);
}

export function Stagger({
	children,
	className,
	inView = false,
}: {
	children: ReactNode;
	className?: string;
	inView?: boolean;
}) {
	return (
		<motion.div
			className={className}
			variants={staggerParent as Variants}
			initial="hidden"
			{...(inView
				? { whileInView: "show", viewport: { once: true, margin: "-40px" } }
				: { animate: "show" })}>
			{children}
		</motion.div>
	);
}

export function StaggerItem({
	children,
	className,
	style,
}: {
	children: ReactNode;
	className?: string;
	style?: CSSProperties;
}) {
	return (
		<motion.div className={className} style={style} variants={fadeUp}>
			{children}
		</motion.div>
	);
}

export function PageTransition({
	children,
	routeKey,
}: {
	children: ReactNode;
	routeKey: string;
}) {
	return (
		<motion.div
			key={routeKey}
			initial={{ opacity: 0, y: 6 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.18, ease: EASE_OUT }}>
			{children}
		</motion.div>
	);
}

/** Count-up angka saat elemen masuk viewport (sekali). */
export function CountUp({
	value,
	decimals = 0,
	duration,
	format,
	className,
}: {
	value: number;
	decimals?: number;
	duration?: number;
	format?: (n: number) => string;
	className?: string;
}) {
	const { ref, value: v } = useCountUp(value, { decimals, duration });
	return (
		<span ref={ref} className={className}>
			{format
				? format(v)
				: v.toLocaleString("id-ID", {
						minimumFractionDigits: decimals,
						maximumFractionDigits: decimals,
					})}
		</span>
	);
}
