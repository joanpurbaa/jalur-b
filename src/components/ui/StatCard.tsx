import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import IconTile from "./IconTile";
import StatusBadge from "./StatusBadge";
import MeterBar from "./MeterBar";
import Card from "./Card";
import type { Tone } from "../../lib/modules";
import { statusStyles, type StatusVariant } from "../../lib/status";

interface StatCardProps {
	label: string;
	value: ReactNode;
	subtitle?: string;
	icon: LucideIcon;
	tone?: Tone;
	status?: StatusVariant;
	statusLabel?: string;
	/** Bar netral indigo (0-100) atau memakai status bila eksplisit. */
	progress?: number | null;
	progressUseStatusColor?: boolean;
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
	tone = "neutral",
	status,
	statusLabel,
	progress,
	progressUseStatusColor = false,
	segments,
	href,
	onClick,
	className = "",
}: StatCardProps) {
	const valueColor =
		status && status !== "insight" && status !== "neutral"
			? statusStyles[status].text
			: "text-slate-900";

	const body = (
		<Card
			lift
			padding="md"
			onClick={onClick}
			className={`h-full flex flex-col justify-between gap-4 ${
				href || onClick ? "cursor-pointer" : ""
			} ${className}`}>
			<div className="flex items-start justify-between gap-3">
				<IconTile icon={icon} tone={tone} size="md" />
				{status && statusLabel && (
					<StatusBadge variant={status} label={statusLabel} size="sm" />
				)}
			</div>

			<div>
				<p className="text-xs font-medium text-slate-500">{label}</p>
				<div className="mt-1 flex items-baseline gap-2">
					<span className={`num-display text-2xl sm:text-3xl ${valueColor}`}>
						{value}
					</span>
				</div>
				{subtitle && (
					<p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
						{subtitle}
					</p>
				)}
			</div>

			{progress != null && (
				<MeterBar
					value={progress}
					max={100}
					status={
						progressUseStatusColor && status && status !== "neutral"
							? status
							: "insight"
					}
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
								className={`h-1.5 rounded-full transition-colors ${
									active ? barColor : "bg-slate-200"
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
			<Link to={href} className="block h-full">
				{body}
			</Link>
		);
	}
	return body;
}
