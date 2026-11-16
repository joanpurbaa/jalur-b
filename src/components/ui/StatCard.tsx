import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import IconTile from "./IconTile";
import StatusBadge from "./StatusBadge";
import MeterBar from "./MeterBar";
import Card from "./Card";
import { toneStyles, type Tone } from "../../lib/modules";
import type { StatusVariant } from "../../lib/status";

interface StatCardProps {
	label: string;
	value: ReactNode;
	subtitle?: string;
	icon: LucideIcon;
	tone?: Tone;
	status?: StatusVariant;
	statusLabel?: string;
	/** Nilai 0-100 untuk mini bar visual di bawah kartu. */
	progress?: number | null;
	/** Level 1..3 untuk indikator 3-segmen (mis. Risiko Rendah/Sedang/Tinggi). */
	segments?: { active: 1 | 2 | 3; status: StatusVariant } | null;
	href?: string;
	onClick?: () => void;
	className?: string;
}

export default function StatCard({
	label,
	value,
	subtitle,
	icon,
	tone = "beranda",
	status,
	statusLabel,
	progress,
	segments,
	href,
	onClick,
	className = "",
}: StatCardProps) {
	const t = toneStyles(tone);
	const body = (
		<Card
			lift
			tilt
			padding="md"
			onClick={onClick}
			className={`h-full flex flex-col justify-between gap-4 ${href || onClick ? "cursor-pointer" : ""} ${className}`}>
			<div className="flex items-start justify-between gap-3">
				<IconTile icon={icon} tone={tone} size="md" />
				{status && (
					<StatusBadge
						variant={status}
						label={statusLabel}
						size="sm"
					/>
				)}
			</div>

			<div>
				<p className="text-xs font-semibold uppercase tracking-wider text-neutral/55">
					{label}
				</p>
				<div className="mt-1 flex items-baseline gap-2">
					<span className="num-display text-2xl sm:text-3xl text-neutral">
						{value}
					</span>
				</div>
				{subtitle && (
					<p className="text-xs text-neutral/60 mt-1">{subtitle}</p>
				)}
			</div>

			{progress != null && (
				<MeterBar
					value={progress}
					max={100}
					status={status ?? "insight"}
					colors={status ? undefined : [t.hex, t.hex]}
					height="sm"
					ariaLabel={`${label} ${progress}%`}
				/>
			)}

			{segments && (
				<div className="grid grid-cols-3 gap-1.5" aria-hidden>
					{[1, 2, 3].map((idx) => {
						const active = idx <= segments.active;
						const barColor =
							segments.status === "healthy"
								? "bg-emerald-500"
								: segments.status === "warning"
									? "bg-amber-500"
									: "bg-rose-500";
						return (
							<span
								key={idx}
								className={`h-2 rounded-full transition-colors ${
									active ? barColor : "bg-slate-900/[0.07]"
								}`}
							/>
						);
					})}
				</div>
			)}
		</Card>
	);

	if (href) {
		return (
			<a href={href} className="block h-full focus-visible:outline-none">
				{body}
			</a>
		);
	}
	return body;
}
