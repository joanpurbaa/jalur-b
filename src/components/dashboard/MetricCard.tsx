import type { LucideIcon } from "lucide-react";
import { statusStyles, type StatusVariant } from "../../lib/status";
import Card from "../ui/Card";
import IconTile from "../ui/IconTile";

interface MetricCardProps {
	label: string;
	value: string;
	icon: LucideIcon;
	variant: StatusVariant;
}

export default function MetricCard({
	label,
	value,
	icon,
	variant,
}: MetricCardProps) {
	const isSemantic =
		variant === "healthy" || variant === "warning" || variant === "risk";
	const valColor = isSemantic ? statusStyles[variant].text : "text-slate-900";

	return (
		<Card padding="md" className="flex flex-col justify-between gap-3 h-full">
			<IconTile icon={icon} tone="neutral" size="sm" />
			<div>
				<p className="text-xs font-medium text-slate-500">{label}</p>
				<p className={`num-display text-xl sm:text-2xl mt-1 ${valColor}`}>
					{value}
				</p>
			</div>
		</Card>
	);
}
