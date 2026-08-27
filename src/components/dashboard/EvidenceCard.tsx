import { Calendar, Sparkles } from "lucide-react";

interface EvidenceCardProps {
	category: string;
	title: string;
	role: string;
	description: string;
	impactLabel: string;
	impactValue: string;
	date: string;
	aiGenerated?: boolean;
}

export default function EvidenceCard({
	category,
	title,
	role,
	description,
	impactLabel,
	impactValue,
	date,
	aiGenerated,
}: EvidenceCardProps) {
	return (
		<div className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-6 flex flex-col">
			<span className="self-start px-2.5 py-1 bg-neutral/5 text-neutral/60 text-[11px] font-semibold rounded-lg mb-4">
				{category}
			</span>

			<h4 className="text-base font-bold text-neutral mb-1">{title}</h4>
			<p className="text-xs font-semibold text-primary mb-3">{role}</p>
			<p className="text-sm text-neutral/60 leading-relaxed mb-4">{description}</p>

			<div className="bg-neutral/5 rounded-xl p-4 mb-4">
				<p className="text-[11px] text-neutral/50 font-medium mb-1">
					{impactLabel}
				</p>
				<p className="text-sm font-bold text-neutral">{impactValue}</p>
			</div>

			<div className="flex items-center justify-between pt-4 border-t border-neutral/10 mt-auto">
				<div className="flex items-center gap-1.5 text-xs text-neutral/50">
					<Calendar size={13} />
					<span>{date}</span>
				</div>
				{aiGenerated && <Sparkles size={14} className="text-primary/50" />}
			</div>
		</div>
	);
}
