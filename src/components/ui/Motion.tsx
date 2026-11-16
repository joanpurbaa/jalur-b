import {
	useRef,
	type CSSProperties,
	type HTMLAttributes,
	type MouseEvent,
	type ReactNode,
} from "react";
import {
	motion,
	useMotionValue,
	useReducedMotion,
	useSpring,
	useTransform,
} from "motion/react";
import { DUR, EASE_OUT, fadeUp, staggerParent, useCountUp } from "../../lib/motion";

/* ------------------------------------------------------------------ */
/* SectionReveal — fade+slide saat masuk viewport (sekali).            */
/* ------------------------------------------------------------------ */
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
			initial={{ opacity: 0, y: 16 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-40px" }}
			transition={{ duration: DUR.slow, ease: EASE_OUT, delay }}>
			{children}
		</Comp>
	);
}

/* ------------------------------------------------------------------ */
/* Stagger — anak-anak masuk bertahap.                                 */
/* ------------------------------------------------------------------ */
export function Stagger({
	children,
	className,
	inView = false,
}: {
	children: ReactNode;
	className?: string;
	/** true: mulai saat masuk viewport; false: langsung saat mount. */
	inView?: boolean;
}) {
	return (
		<motion.div
			className={className}
			variants={staggerParent}
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

/* ------------------------------------------------------------------ */
/* PageTransition — fade/slide ~200ms antar halaman.                   */
/* ------------------------------------------------------------------ */
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
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.22, ease: EASE_OUT }}>
			{children}
		</motion.div>
	);
}

/* ------------------------------------------------------------------ */
/* Tilt — hover naik + tilt 3D ringan (maks ~5°).                       */
/* ------------------------------------------------------------------ */
export function Tilt({
	children,
	className = "",
	max = 5,
	...rest
}: {
	children: ReactNode;
	className?: string;
	max?: number;
} & Omit<HTMLAttributes<HTMLDivElement>, "onMouseMove" | "onMouseLeave" | "style" | "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart">) {
	const ref = useRef<HTMLDivElement>(null);
	const reduce = useReducedMotion();
	const mx = useMotionValue(0.5);
	const my = useMotionValue(0.5);
	const rx = useSpring(useTransform(my, [0, 1], [max, -max]), {
		stiffness: 220,
		damping: 22,
	});
	const ry = useSpring(useTransform(mx, [0, 1], [-max, max]), {
		stiffness: 220,
		damping: 22,
	});

	const onMove = (e: MouseEvent<HTMLDivElement>) => {
		if (reduce || !ref.current) return;
		const r = ref.current.getBoundingClientRect();
		mx.set((e.clientX - r.left) / r.width);
		my.set((e.clientY - r.top) / r.height);
	};
	const onLeave = () => {
		mx.set(0.5);
		my.set(0.5);
	};

	return (
		<motion.div
			ref={ref}
			onMouseMove={onMove}
			onMouseLeave={onLeave}
			whileHover={reduce ? undefined : { y: -3 }}
			transition={{ duration: DUR.base, ease: EASE_OUT }}
			style={
				reduce
					? undefined
					: { rotateX: rx, rotateY: ry, transformPerspective: 900 }
			}
			className={className}
			{...rest}>
			{children}
		</motion.div>
	);
}

/* ------------------------------------------------------------------ */
/* CountUp — angka yang menghitung naik saat terlihat.                  */
/* ------------------------------------------------------------------ */
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
			{format ? format(v) : v.toLocaleString("id-ID", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
		</span>
	);
}

/* ------------------------------------------------------------------ */
/* Float — melayang halus (maks 6px, lambat).                           */
/* ------------------------------------------------------------------ */
export function Float({
	children,
	className = "",
	delay = 0,
}: {
	children: ReactNode;
	className?: string;
	delay?: number;
}) {
	return (
		<div
			className={`motion-safe:animate-float ${className}`}
			style={{ animationDelay: `${delay}s` }}>
			{children}
		</div>
	);
}
