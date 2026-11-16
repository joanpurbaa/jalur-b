import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT, useRevealOnce } from "../../lib/motion";
import { CountUp } from "./Motion";

interface HalfGaugeProps {
	value: number | null;
	max?: number;
	width?: number;
	stroke?: number;
	label?: string;
	suffix?: string;
	/** Zona warna status muted (hijau → amber → merah). */
	stops?: string[];
	className?: string;
}

/** Speedometer setengah lingkaran dengan zona status muted dan jarum netral. */
export default function HalfGauge({
	value,
	max = 100,
	width = 230,
	stroke = 16,
	label = "Skor",
	suffix,
	stops = ["#34d399", "#fbbf24", "#fb7185"],
	className = "",
}: HalfGaugeProps) {
	const gid = useId().replace(/:/g, "");
	const reduce = useReducedMotion();
	const { ref, inView } = useRevealOnce<HTMLDivElement>();
	const r = (width - stroke) / 2;
	const h = r + stroke;
	const cx = width / 2;
	const cy = r + stroke / 2;
	const len = Math.PI * r;
	const pct = value == null ? 0 : Math.max(0, Math.min(1, value / max));
	const shown = inView || reduce;
	const angle = -90 + 180 * (shown ? pct : 0);

	const arc = `M ${stroke / 2} ${cy} A ${r} ${r} 0 0 1 ${width - stroke / 2} ${cy}`;

	return (
		<div
			ref={ref}
			role="img"
			aria-label={
				value == null
					? `${label}: belum ada data`
					: `${label}: ${value} dari ${max}`
			}
			className={`relative inline-flex flex-col items-center ${className}`}
			style={{ width }}>
			<svg width={width} height={h + 8} viewBox={`0 0 ${width} ${h + 8}`}>
				<defs>
					<linearGradient id={`hg${gid}`} x1="0" y1="0" x2="1" y2="0">
						{stops.map((c, i) => (
							<stop
								key={c + i}
								offset={`${(i / (stops.length - 1)) * 100}%`}
								stopColor={c}
							/>
						))}
					</linearGradient>
				</defs>
				<path
					d={arc}
					fill="none"
					stroke="rgba(15,23,42,0.08)"
					strokeWidth={stroke}
					strokeLinecap="round"
				/>
				<motion.path
					d={arc}
					fill="none"
					stroke={`url(#hg${gid})`}
					strokeWidth={stroke}
					strokeLinecap="round"
					strokeDasharray={len}
					initial={{ strokeDashoffset: len }}
					animate={{ strokeDashoffset: shown ? len * (1 - pct) : len }}
					transition={{ duration: reduce ? 0 : 0.95, ease: EASE_OUT }}
				/>
				<motion.g
					initial={{ rotate: -90 }}
					animate={{ rotate: angle }}
					transition={{ duration: reduce ? 0 : 0.95, ease: EASE_OUT }}
					style={{ originX: `${cx}px`, originY: `${cy}px` }}>
					<line
						x1={cx}
						y1={cy}
						x2={cx}
						y2={cy - r + stroke}
						stroke="#0f172a"
						strokeWidth={2.5}
						strokeLinecap="round"
					/>
				</motion.g>
				<circle cx={cx} cy={cy} r={6} fill="#0f172a" />
				<circle cx={cx} cy={cy} r={2.5} fill="#ffffff" />
			</svg>
			<div className="-mt-1 flex flex-col items-center">
				<span className="num-display text-4xl text-slate-900">
					{value == null ? "—" : <CountUp value={value} />}
				</span>
				{suffix && (
					<span className="text-xs font-medium text-slate-500 mt-1">
						{suffix}
					</span>
				)}
			</div>
		</div>
	);
}
