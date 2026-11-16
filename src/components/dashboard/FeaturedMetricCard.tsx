import type { LucideIcon } from "lucide-react";
import ScoreRing from "../ui/ScoreRing";
import IconTile from "../ui/IconTile";
import Card from "../ui/Card";

interface FeaturedMetricCardProps {
	title: string;
	value: number;
	description: string;
	icon: LucideIcon;
	badgeLabel?: string;
}

/**
 * Metrik utama di halaman Skill & AI memakai skala netral indigo
 * (bukan status merah/hijau) karena exposure/relevance bersifat deskriptif.
 */
export default function FeaturedMetricCard({
	title,
	value,
	description,
	icon: Icon,
	badgeLabel,
}: FeaturedMetricCardProps) {
	return (
		<Card
			lift
			padding="lg"
			className="flex flex-col sm:flex-row items-center gap-6">
			<ScoreRing
				value={value}
				max={100}
				size={132}
				stroke={12}
				status="insight"
				suffix="%"
				label={title}
			/>

			<div className="flex-1 min-w-0 text-center sm:text-left">
				<div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-2">
					<IconTile icon={Icon} tone="indigo" size="sm" />
					<h3 className="text-base font-bold text-slate-900">{title}</h3>
					{badgeLabel && (
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/80">
							{badgeLabel}
						</span>
					)}
				</div>
				<p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
					{description}
				</p>
			</div>
		</Card>
	);
}
