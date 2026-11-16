import { useId, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT, useRevealOnce } from "../../lib/motion";
import { statusMeta, type StatusVariant } from "../../lib/status";
import { CountUp } from "./Motion";

interface ScoreRingProps {
	value: number | null;
	max?: number;
	size?: number;
	stroke?: number;
	status?: StatusVariant;
	colors?: [string, string];
	suffix?: string;
	label?: string;
	decimals?: number;
	children?: ReactNode;
	onDark?: boolean;
	className?: string;
	ariaLabel?: string;
}

/**
 * Radial gauge dengan animasi tumbuh saat masuk viewport dan count-up angka.
 * Warna ring menggunakan indigo untuk metrik netral atau status muted bila eksplisit.
 */
export default function ScoreRing({
	value,
	max = 100,
	size = 156,
	stroke = 13,
	status = "insight",
	colors,
	suffix,
	label,
	decimals = 0,
	children,
	onDark = false,
	className = "",
	ariaLabel,
}: ScoreRingProps) {
	const gid = useId().replace(/:/g, "");
	const reduce = useReducedMotion();
	const { ref, inView } = useRevealOnce<HTMLDivElement>();
	const [c1, c2] = colors ?? [statusMeta[status].hex, statusMeta[status].hex2];
	const r = (size - stroke) / 2;
	const circ = 2 * Math.PI * r;
	const pct = value == null ? 0 : Math.max(0, Math.min(1, value / max));
	const numSize =
		size >= 150
			? "text-4xl sm:text-5xl"
			: size >= 110
				? "text-3xl"
				: size >= 80
					? "text-xl"
					: "text-base";

	return (
		<div
			ref={ref}
			role="img"
			aria-label={
				ariaLabel ??
				(value == null
					? `${label ?? "Skor"}: belum ada data`
					: `${label ?? "Skor"}: ${value} dari ${max}`)
			}
			className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
			style={{ width: size, height: size }}>
			<svg
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				className="-rotate-90">
				<defs>
					<linearGradient id={`g${gid}`} x1="0" y1="0" x2="1" y2="1">
						<stop offset="0%" stopColor={c1} />
						<stop offset="100%" stopColor={c2} />
					</linearGradient>
				</defs>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={r}
					fill="none"
					stroke={onDark ? "rgba(255,255,255,0.2)" : "rgba(15,23,42,0.08)"}
					strokeWidth={stroke}
				/>
				<motion.circle
					cx={size / 2}
					cy={size / 2}
					r={r}
					fill="none"
					stroke={`url(#g${gid})`}
					strokeWidth={stroke}
					strokeLinecap="round"
					strokeDasharray={circ}
					initial={{ strokeDashoffset: circ }}
					animate={{
						strokeDashoffset: inView || reduce ? circ * (1 - pct) : circ,
					}}
					transition={{ duration: reduce ? 0 : 0.95, ease: EASE_OUT }}
				/>
			</svg>
			<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
				{children ?? (
					<>
						<span
							className={`num-display ${numSize} ${
								onDark ? "text-white" : "text-slate-900"
							}`}>
							{value == null ? (
								"—"
							) : (
								<CountUp value={value} decimals={decimals} />
							)}
						</span>
						{suffix && (
							<span
								className={`mt-1 text-xs font-medium ${
									onDark ? "text-white/75" : "text-slate-500"
								}`}>
								{suffix}
							</span>
						)}
					</>
				)}
			</div>
		</div>
	);
}
