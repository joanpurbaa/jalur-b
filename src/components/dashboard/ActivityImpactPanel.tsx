import { Layers } from "lucide-react";
import ActivityImpactBar from "../ui/ActivityImpactBar";
import Card from "../ui/Card";
import IconTile from "../ui/IconTile";
import ExpandableText from "../ui/ExpandableText";
import { parseDecimal } from "../../lib/parseNumeric";

interface ActivityItem {
	key: string;
	title: string;
	score?: string;
	level: string;
	explanation?: string;
}

interface ActivityImpactPanelProps {
	title?: string;
	description?: string;
	activities?: ActivityItem[];
}

function normalizeImpactLevel(
	value: string | null | undefined,
): "HIGH" | "MEDIUM" | "LOW" {
	const v = (value ?? "").toLowerCase();
	if (v.includes("high") || v.includes("tinggi")) return "HIGH";
	if (v.includes("low") || v.includes("rendah")) return "LOW";
	return "MEDIUM";
}

export default function ActivityImpactPanel({
	title = "Peta Aktivitas & Dampak AI",
	description,
	activities = [],
}: ActivityImpactPanelProps) {
	return (
		<Card padding="lg" className="mb-8">
			<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
				<div className="flex items-start gap-3">
					<IconTile icon={Layers} tone="indigo" size="md" />
					<div className="min-w-0">
						<h3 className="text-base font-bold text-slate-900">{title}</h3>
						<ExpandableText
							text={
								description ||
								"Intensitas dampak AI pada rutinitas kerjamu saat ini."
							}
							maxLines={3}
							className="text-sm text-slate-600 mt-1 leading-relaxed"
						/>
					</div>
				</div>

				{/* Legenda 1 hue indigo dengan 3 tingkat intensitas */}
				<div className="flex flex-wrap items-center gap-2 text-xs font-medium shrink-0">
					<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
						<span className="w-2 h-2 rounded-full bg-indigo-300" />
						Rendah
					</span>
					<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
						<span className="w-2 h-2 rounded-full bg-indigo-500" />
						Sedang
					</span>
					<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200">
						<span className="w-2 h-2 rounded-full bg-indigo-700" />
						Tinggi
					</span>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{activities.map((item) => {
					const lvl = normalizeImpactLevel(item.level);
					const numScore = item.score ? parseDecimal(item.score) : undefined;
					return (
						<div
							key={item.key || item.title}
							className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-4 space-y-2">
							<ActivityImpactBar
								activity={item.title}
								level={lvl}
								score={numScore}
							/>
							{item.explanation && (
								<p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1 line-clamp-2">
									{item.explanation}
								</p>
							)}
						</div>
					);
				})}
			</div>
		</Card>
	);
}
