import {
	Award,
	BookOpen,
	Calendar,
	Cpu,
	FileText,
	FolderKanban,
	Medal,
	MessageSquareQuote,
	Pencil,
	Trash2,
	Trophy,
	type LucideIcon,
} from "lucide-react";
import Card from "../ui/Card";

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

const CATEGORY_ICON: Record<string, LucideIcon> = {
	Project: FolderKanban,
	Achievement: Trophy,
	Feedback: MessageSquareQuote,
	Certificate: Medal,
	Award: Award,
	Training: BookOpen,
	Other: FileText,
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
	const Icon = CATEGORY_ICON[category] ?? FolderKanban;

	return (
		<Card lift padding="none" className="overflow-hidden flex flex-col h-full">
			{attachmentUrl ? (
				<div className="relative h-32 w-full overflow-hidden bg-slate-100 border-b border-slate-100 shrink-0">
					<img
						src={attachmentUrl}
						alt={title}
						className="h-full w-full object-cover"
					/>
					<span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 bg-white/95 text-slate-700">
						<Icon size={12} />
						{category}
					</span>
				</div>
			) : (
				<div className="h-14 w-full bg-slate-50/80 px-5 flex items-center justify-between border-b border-slate-100 shrink-0">
					<span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700">
						<Icon size={12} className="text-slate-500" />
						{category}
					</span>
					{aiGenerated && (
						<span
							title="Dibantu AI"
							className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium">
							<Cpu size={12} />
							AI
						</span>
					)}
				</div>
			)}

			<div className="p-5 flex flex-col flex-1 justify-between">
				<div>
					<div className="flex items-start justify-between gap-2 mb-1">
						<h4 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
							{title}
						</h4>
						<div className="flex items-center gap-1 shrink-0">
							{onEdit && (
								<button
									type="button"
									onClick={onEdit}
									aria-label={`Edit ${title}`}
									title="Edit bukti"
									className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer">
									<Pencil size={14} />
								</button>
							)}
							{onDelete && (
								<button
									type="button"
									onClick={onDelete}
									aria-label={`Hapus ${title}`}
									title="Hapus bukti"
									className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer">
									<Trash2 size={14} />
								</button>
							)}
						</div>
					</div>

					<p className="text-xs font-medium text-indigo-700 mb-2.5 truncate">
						{role}
					</p>
					<p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2 min-h-[2.75rem]">
						{description || "Tidak ada deskripsi tambahan."}
					</p>
				</div>

				<div>
					<div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 mb-3.5">
						<p className="text-[11px] font-medium text-slate-500 mb-0.5">
							{impactLabel}
						</p>
						<p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
							{impactValue}
						</p>
					</div>

					<div className="flex items-center gap-1.5 text-xs text-slate-500 pt-3 border-t border-slate-100">
						<Calendar size={13} />
						<span>{date}</span>
					</div>
				</div>
			</div>
		</Card>
	);
}
