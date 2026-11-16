import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT, useRevealOnce } from "../../lib/motion";
import { statusMeta, type StatusVariant } from "../../lib/status";

interface MeterBarProps {
	value: number;
	max?: number;
	target?: number | null;
	targetLabel?: string;
	status?: StatusVariant;
	colors?: [string, string];
	height?: "sm" | "md" | "lg";
	className?: string;
	ariaLabel?: string;
	showTicks?: boolean;
}

const H = { sm: "h-2", md: "h-2.5", lg: "h-4" } as const;

/** Bar horizontal yang tumbuh saat terlihat, dengan garis target opsional. */
export default function MeterBar({
	value,
	max = 100,
	target,
	targetLabel = "Target",
	status = "insight",
	colors,
	height = "md",
	className = "",
	ariaLabel,
	showTicks = false,
}: MeterBarProps) {
	const reduce = useReducedMotion();
	const { ref, inView } = useRevealOnce<HTMLDivElement>();
	const [c1, c2] = colors ?? [statusMeta[status].hex, statusMeta[status].hex2];
	const safeMax = max > 0 ? max : 1;
	const pct = Math.max(0, Math.min(100, (value / safeMax) * 100));
	const tPct =
		target != null ? Math.max(0, Math.min(100, (target / safeMax) * 100)) : null;

	return (
		<div ref={ref} className={`relative ${className}`}>
			<div
				role="meter"
				aria-valuemin={0}
				aria-valuemax={safeMax}
				aria-valuenow={value}
				aria-label={ariaLabel}
				className={`relative w-full overflow-hidden rounded-full bg-slate-200/75 ${H[height]}`}>
				<motion.div
					className="absolute inset-y-0 left-0 rounded-full"
					style={{
						width: `${pct}%`,
						originX: 0,
						background: `linear-gradient(90deg, ${c1}, ${c2})`,
					}}
					initial={{ scaleX: 0 }}
					animate={{ scaleX: inView || reduce ? 1 : 0 }}
					transition={{ duration: reduce ? 0 : 0.85, ease: EASE_OUT }}
				/>
				{showTicks &&
					[25, 50, 75].map((t) => (
						<span
							key={t}
							aria-hidden
							className="absolute inset-y-0 w-px bg-white/75"
							style={{ left: `${t}%` }}
						/>
					))}
			</div>
			{tPct != null && (
				<div
					className="pointer-events-none absolute -top-1 -bottom-1 flex flex-col items-center"
					style={{ left: `${tPct}%`, transform: "translateX(-50%)" }}>
					<span className="h-full w-[2.5px] rounded-full bg-slate-900 ring-2 ring-white" />
					<span className="sr-only">
						{targetLabel}: {target}
					</span>
				</div>
			)}
		</div>
	);
}
