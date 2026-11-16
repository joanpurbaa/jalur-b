import {
	Award,
	BookOpen,
	Calendar,
	FolderKanban,
	Medal,
	MessageSquareQuote,
	Pencil,
	Sparkles,
	Trash2,
	TrendingUp,
	Trophy,
	type LucideIcon,
} from "lucide-react";
import Card from "../ui/Card";
import IconTile from "../ui/IconTile";
import type { Tone } from "../../lib/modules";

interface EvidenceCardProps {
	category: string;
	title: string;
	role: string;
	description: string;
	impactLabel: string;
	impactValue: string;
	date: string;
	aiGenerated?: boolean;
	attachmentUrl?: string | null;
	onEdit?: () => void;
	onDelete?: () => void;
}

const CATEGORY_VISUAL: Record<
	string,
	{ icon: LucideIcon; tone: Tone; badge: string; banner: string }
> = {
	Project: {
		icon: FolderKanban,
		tone: "indigo",
		badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
		banner: "from-indigo-500/15 via-sky-500/10 to-violet-500/15",
	},
	Achievement: {
		icon: Trophy,
		tone: "safe",
		badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
		banner: "from-emerald-500/15 via-teal-500/10 to-cyan-500/15",
	},
	Feedback: {
		icon: MessageSquareQuote,
		tone: "violet",
		badge: "bg-violet-50 text-violet-700 border-violet-200",
		banner: "from-violet-500/15 via-fuchsia-500/10 to-indigo-500/15",
	},
	Certificate: {
		icon: Medal,
		tone: "cyan",
		badge: "bg-cyan-50 text-cyan-800 border-cyan-200",
		banner: "from-cyan-500/15 via-sky-500/10 to-blue-500/15",
	},
	Award: {
		icon: Award,
		tone: "caution",
		badge: "bg-amber-50 text-amber-800 border-amber-200",
		banner: "from-amber-500/15 via-orange-500/10 to-yellow-500/15",
	},
	Training: {
		icon: BookOpen,
		tone: "teal",
		badge: "bg-teal-50 text-teal-800 border-teal-200",
		banner: "from-teal-500/15 via-emerald-500/10 to-sky-500/15",
	},
	Other: {
		icon: Sparkles,
		tone: "bukti-karier",
		badge: "bg-sky-50 text-sky-800 border-sky-200",
		banner: "from-sky-500/15 via-blue-500/10 to-indigo-500/15",
	},
};

export default function EvidenceCard({
	category,
	title,
	role,
	description,
	impactLabel,
	impactValue,
	date,
	aiGenerated,
	attachmentUrl,
	onEdit,
	onDelete,
}: EvidenceCardProps) {
	const vis = CATEGORY_VISUAL[category] ?? CATEGORY_VISUAL.Other;
	const Icon = vis.icon;

	return (
		<Card lift padding="none" className="overflow-hidden flex flex-col h-full">
			{attachmentUrl ? (
				<div className="relative h-36 w-full overflow-hidden bg-slate-100">
					<img
						src={attachmentUrl}
						alt={title}
						className="h-full w-full object-cover"
					/>
					<span
						className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-xl border backdrop-blur-xs bg-white/90 ${vis.badge}`}>
						<Icon size={12} />
						{category}
					</span>
				</div>
			) : (
				<div
					className={`relative h-28 w-full bg-gradient-to-br ${vis.banner} px-5 flex items-center justify-between border-b border-slate-100`}>
					<IconTile icon={Icon} tone={vis.tone} size="md" />
					<span
						className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ${vis.badge}`}>
						<Icon size={12} />
						{category}
					</span>
				</div>
			)}

			<div className="p-5 sm:p-6 flex flex-col flex-1">
				<div className="flex items-start justify-between gap-2 mb-1.5">
					<h4 className="text-base font-extrabold text-neutral leading-snug">
						{title}
					</h4>
					<div className="flex items-center gap-1 shrink-0">
						{aiGenerated && (
							<span title="Dibantu AI">
								<Sparkles size={14} className="text-violet-500" />
							</span>
						)}
						{onEdit && (
							<button
								type="button"
								onClick={onEdit}
								aria-label={`Edit ${title}`}
								title="Edit bukti"
								className="p-1.5 rounded-xl text-neutral/45 hover:text-sky-600 hover:bg-sky-50 transition cursor-pointer">
								<Pencil size={14} />
							</button>
						)}
						{onDelete && (
							<button
								type="button"
								onClick={onDelete}
								aria-label={`Hapus ${title}`}
								title="Hapus bukti"
								className="p-1.5 rounded-xl text-neutral/45 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer">
								<Trash2 size={14} />
							</button>
						)}
					</div>
				</div>

				<p className="text-xs font-bold text-sky-700 mb-3">{role}</p>
				<p className="text-sm text-neutral/70 leading-relaxed mb-4 line-clamp-3">
					{description}
				</p>

				<div className="rounded-2xl bg-gradient-to-br from-sky-50/80 to-indigo-50/50 border border-sky-100 p-3.5 mb-4 mt-auto">
					<div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-800 mb-1">
						<TrendingUp size={12} />
						<span>{impactLabel}</span>
					</div>
					<p className="text-xs sm:text-sm font-bold text-neutral leading-snug">
						{impactValue}
					</p>
				</div>

				<div className="flex items-center gap-1.5 text-xs font-medium text-neutral/50 pt-3 border-t border-slate-100">
					<Calendar size={13} />
					<span>{date}</span>
				</div>
			</div>
		</Card>
	);
}
