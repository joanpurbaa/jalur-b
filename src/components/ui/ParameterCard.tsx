import type { LucideIcon } from "lucide-react";
import { Pencil } from "lucide-react";
import type { FinanceTone } from "../../lib/status";
import IconTile from "./IconTile";
import Card from "./Card";

interface ParameterCardProps {
	label: string;
	value: string;
	sublabel?: string | null;
	icon: LucideIcon;
	tone?: FinanceTone;
	onEdit?: () => void;
}

export default function ParameterCard({
	label,
	value,
	sublabel,
	icon,
	onEdit,
}: ParameterCardProps) {
	return (
		<Card lift padding="md" className="flex flex-col justify-between h-full">
			<div className="flex items-start justify-between gap-3 mb-4">
				<IconTile icon={icon} tone="neutral" size="md" />
				{onEdit && (
					<button
						type="button"
						onClick={onEdit}
						aria-label={`Ubah ${label}`}
						className="min-w-[38px] min-h-[38px] inline-flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer">
						<Pencil size={15} />
					</button>
				)}
			</div>
			<div>
				<p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
				<p className="num-display text-xl sm:text-2xl text-slate-900">{value}</p>
				{sublabel && (
					<p className="text-xs text-slate-500 mt-1.5">{sublabel}</p>
				)}
			</div>
		</Card>
	);
}
