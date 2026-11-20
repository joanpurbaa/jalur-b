import { Layers } from "lucide-react";
import ActivityImpactBar from "../ui/ActivityImpactBar";
import ExpandableText from "../ui/ExpandableText";
import LockedPreviewCard from "../ui/LockedPreviewCard";
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

const DUMMY_ACTIVITIES: {
	title: string;
	level: "HIGH" | "MEDIUM" | "LOW";
	score: number;
	explanation: string;
}[] = [
	{
		title: "Menyusun laporan rutin & rekap dokumen",
		level: "HIGH",
		score: 78,
		explanation: "Aktivitas terstruktur dengan pola berulang mudah dipercepat oleh AI generatif.",
	},
	{
		title: "Riset referensi & ringkasan bahan diskusi",
		level: "MEDIUM",
		score: 56,
		explanation: "AI dapat membantu draf awal, namun validasi konteks tetap membutuhkan penilaianmu.",
	},
	{
		title: "Koordinasi lintas tim & negosiasi prioritas",
		level: "LOW",
		score: 26,
		explanation: "Membutuhkan empati, konteks organisasi, dan keputusan lintas pemangku kepentingan.",
	},
	{
		title: "Evaluasi keputusan strategis jangka panjang",
		level: "LOW",
		score: 22,
		explanation: "Pertimbangan risiko bisnis tetap bertumpu pada pengalaman profesional.",
	},
];

export default function ActivityImpactPanel({
	title = "Peta Aktivitas & Dampak AI",
	description,
	activities = [],
}: ActivityImpactPanelProps) {
	return (
		<LockedPreviewCard
			featureId="ai_exposure_detail"
			title={title}
			subtitle="Intensitas paparan otomatisasi AI pada aktivitas harianmu"
			icon={Layers}
			className="mb-8"
			previewMaxHeight="max-h-[214px]"
			lockedHint={`Contoh pratinjau · Beli credit untuk rincian ${activities.length} aktivitas aslimu`}
			lockedPreview={
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{DUMMY_ACTIVITIES.map((item) => (
						<div
							key={`dummy-act-${item.title}`}
							className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-4 space-y-2">
							<ActivityImpactBar
								activity={item.title}
								level={item.level}
								score={item.score}
							/>
							<p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1 line-clamp-2">
								{item.explanation}
							</p>
						</div>
					))}
				</div>
			}
			headerRight={
				<div className="hidden md:flex flex-wrap items-center gap-1.5 text-xs font-medium">
					<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
						<span className="w-1.5 h-1.5 rounded-full bg-indigo-300" />
						Rendah
					</span>
					<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
						<span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
						Sedang
					</span>
					<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200">
						<span className="w-1.5 h-1.5 rounded-full bg-indigo-700" />
						Tinggi
					</span>
				</div>
			}>
			<div className="mb-4 pb-3 border-b border-slate-100">
				<ExpandableText
					text={
						description ||
						"Intensitas dampak AI pada rutinitas kerjamu saat ini."
					}
					maxLines={2}
					className="text-sm text-slate-600 leading-relaxed"
				/>
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
		</LockedPreviewCard>
	);
}
