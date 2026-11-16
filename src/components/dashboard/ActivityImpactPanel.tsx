import { Sparkles } from "lucide-react";
import ActivityImpactBar from "../ui/ActivityImpactBar";
import Card from "../ui/Card";
import IconTile from "../ui/IconTile";
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
	title = "Peta Aktivitas & AI Impact",
	description,
	activities = [],
}: ActivityImpactPanelProps) {
	return (
		<Card
			padding="lg"
			className="mb-8 bg-gradient-to-br from-white via-violet-50/35 to-cyan-50/30">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
				<div className="flex items-center gap-3">
					<IconTile icon={Sparkles} tone="skill" size="md" />
					<div>
						<h3 className="text-base sm:text-lg font-extrabold text-neutral">
							{title}
						</h3>
						<p className="text-xs sm:text-sm text-neutral/65 mt-0.5">
							{description ||
								"Intensitas dampak AI pada rutinitas kerjamu saat ini."}
						</p>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
					<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
						<span className="w-2 h-2 rounded-full bg-emerald-500" />
						Rendah
					</span>
					<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
						<span className="w-2 h-2 rounded-full bg-amber-500" />
						Sedang
					</span>
					<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
						<span className="w-2 h-2 rounded-full bg-rose-500" />
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
							className="rounded-2xl border border-slate-200/80 bg-white/85 p-4 space-y-2 shadow-2xs">
							<ActivityImpactBar
								activity={item.title}
								level={lvl}
								score={numScore}
							/>
							{item.explanation && (
								<p className="text-xs text-neutral/65 leading-relaxed pt-1">
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
