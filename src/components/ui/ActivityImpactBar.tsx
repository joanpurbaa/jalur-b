import MeterBar from "./MeterBar";

interface ActivityImpactBarProps {
	activity: string;
	level: "HIGH" | "MEDIUM" | "LOW";
	score?: number;
}

/**
 * Skema satu hue indigo dengan 3 tingkat intensitas (rendah terang, sedang,
 * tinggi pekat) disertai label teks Bahasa Indonesia.
 */
const levelConfig = {
	HIGH: {
		width: 88,
		colors: ["#4338ca", "#4338ca"] as [string, string],
		badge: "bg-indigo-100 text-indigo-900 border-indigo-200",
		label: "Tinggi",
	},
	MEDIUM: {
		width: 58,
		colors: ["#6366f1", "#6366f1"] as [string, string],
		badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
		label: "Sedang",
	},
	LOW: {
		width: 28,
		colors: ["#a5b4fc", "#a5b4fc"] as [string, string],
		badge: "bg-slate-100 text-slate-700 border-slate-200",
		label: "Rendah",
	},
};

export default function ActivityImpactBar({
	activity,
	level,
	score,
}: ActivityImpactBarProps) {
	const cfg = levelConfig[level];
	const pct =
		score != null && score > 0 ? Math.min(100, Math.round(score)) : cfg.width;

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between gap-2">
				<span className="text-sm font-semibold text-slate-900">{activity}</span>
				<span
					className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border shrink-0 ${cfg.badge}`}>
					{cfg.label}
				</span>
			</div>
			<MeterBar
				value={pct}
				max={100}
				colors={cfg.colors}
				height="md"
				ariaLabel={`Dampak AI pada ${activity}: ${cfg.label}`}
			/>
		</div>
	);
}
