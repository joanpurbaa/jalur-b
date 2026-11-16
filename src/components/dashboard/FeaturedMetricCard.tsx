import type { LucideIcon } from "lucide-react";
import { type StatusVariant } from "../../lib/status";
import type { Tone } from "../../lib/modules";
import ScoreRing from "../ui/ScoreRing";
import IconTile from "../ui/IconTile";
import StatusBadge from "../ui/StatusBadge";
import Card from "../ui/Card";

interface FeaturedMetricCardProps {
	title: string;
	value: number;
	description: string;
	icon: LucideIcon;
	variant: StatusVariant;
	tone?: Tone;
	ringColors?: [string, string];
	badgeLabel?: string;
}

export default function FeaturedMetricCard({
	title,
	value,
	description,
	icon: Icon,
	variant,
	tone = "skill",
	ringColors,
	badgeLabel,
}: FeaturedMetricCardProps) {
	return (
		<Card
			lift
			tilt
			padding="lg"
			className="flex flex-col sm:flex-row items-center gap-6">
			<ScoreRing
				value={value}
				max={100}
				size={136}
				stroke={13}
				status={variant}
				colors={ringColors}
				suffix="%"
				label={title}
			/>

			<div className="flex-1 min-w-0 text-center sm:text-left">
				<div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-2">
					<IconTile icon={Icon} tone={tone} size="sm" />
					<h3 className="text-lg font-extrabold text-neutral">{title}</h3>
					{badgeLabel && (
						<StatusBadge label={badgeLabel} variant={variant} size="sm" />
					)}
				</div>
				<p className="text-sm text-neutral/70 leading-relaxed">{description}</p>
			</div>
		</Card>
	);
}
