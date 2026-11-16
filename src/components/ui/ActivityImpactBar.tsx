import { Bot, Sparkles, UserCheck } from "lucide-react";
import MeterBar from "./MeterBar";
import IconTile from "./IconTile";

interface ActivityImpactBarProps {
	activity: string;
	level: "HIGH" | "MEDIUM" | "LOW";
	score?: number;
}

const levelConfig = {
	HIGH: {
		width: 88,
		colors: ["#8b5cf6", "#f43f5e"] as [string, string],
		badge: "bg-rose-50 text-rose-700 border-rose-200",
		label: "Tinggi · Otomasi AI",
		tone: "danger" as const,
		icon: Bot,
	},
	MEDIUM: {
		width: 58,
		colors: ["#f59e0b", "#fbbf24"] as [string, string],
		badge: "bg-amber-50 text-amber-800 border-amber-200",
		label: "Sedang · Co-Pilot AI",
		tone: "caution" as const,
		icon: Sparkles,
	},
	LOW: {
		width: 28,
		colors: ["#059669", "#34d399"] as [string, string],
		badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
		label: "Rendah · Human-Centric",
		tone: "safe" as const,
		icon: UserCheck,
	},
};

export default function ActivityImpactBar({
	activity,
	level,
	score,
}: ActivityImpactBarProps) {
	const cfg = levelConfig[level];
	const pct = score != null && score > 0 ? Math.min(100, Math.round(score)) : cfg.width;

	return (
		<div className="space-y-2">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div className="flex items-center gap-2.5 min-w-0">
					<IconTile icon={cfg.icon} tone={cfg.tone} size="xs" />
					<span className="text-sm font-bold text-neutral">{activity}</span>
				</div>
				<span
					className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${cfg.badge}`}>
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
