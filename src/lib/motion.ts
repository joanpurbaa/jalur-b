import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion, type Variants } from "motion/react";

/** Easing & durasi konsisten di seluruh app (150–400ms). */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const DUR = { fast: 0.15, base: 0.25, slow: 0.4 } as const;

export const fadeUp: Variants = {
	hidden: { opacity: 0, y: 14 },
	show: { opacity: 1, y: 0, transition: { duration: DUR.slow, ease: EASE_OUT } },
};

export const staggerParent: Variants = {
	hidden: {},
	show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

/**
 * Count-up angka saat elemen masuk viewport (sekali saja).
 * Menghormati prefers-reduced-motion (langsung nilai akhir).
 */
export function useCountUp(
	target: number,
	{ duration = 0.9, decimals = 0 }: { duration?: number; decimals?: number } = {},
) {
	const ref = useRef<HTMLSpanElement | null>(null);
	const inView = useInView(ref, { once: true, margin: "-40px" });
	const reduce = useReducedMotion();
	const [value, setValue] = useState(0);

	useEffect(() => {
		if (!inView) return;
		if (reduce) {
			// Lewati animasi: tampilkan nilai akhir pada frame berikutnya.
			const id = requestAnimationFrame(() => setValue(target));
			return () => cancelAnimationFrame(id);
		}
		const controls = animate(0, target, {
			duration,
			ease: EASE_OUT,
			onUpdate: (v) => setValue(Number(v.toFixed(decimals))),
		});
		return () => controls.stop();
	}, [inView, reduce, target, duration, decimals]);

	return { ref, value: reduce && inView ? target : value };
}

/** True sekali elemen terlihat — untuk ring/bar yang tumbuh sekali. */
export function useRevealOnce<T extends Element>(margin = "-40px") {
	const ref = useRef<T | null>(null);
	const inView = useInView(ref, {
		once: true,
		margin: margin as `${number}px`,
	});
	return { ref, inView };
}
