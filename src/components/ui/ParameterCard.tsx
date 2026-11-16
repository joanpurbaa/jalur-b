import type { LucideIcon } from "lucide-react";
import { Pencil } from "lucide-react";
import { type FinanceTone } from "../../lib/status";
import type { Tone } from "../../lib/modules";
import IconTile from "./IconTile";
import Card from "./Card";

interface ParameterCardProps {
	label: string;
	value: string;
	sublabel?: string | null;
	icon: LucideIcon;
	tone: FinanceTone;
	onEdit?: () => void;
}

const TONE_MAP: Record<FinanceTone, Tone> = {
	indigo: "indigo",
	violet: "violet",
	rose: "danger",
	amber: "caution",
	slate: "finansial",
};

export default function ParameterCard({
	label,
	value,
	sublabel,
	icon: Icon,
	tone,
	onEdit,
}: ParameterCardProps) {
	return (
		<Card lift padding="md" className="flex flex-col justify-between h-full">
			<div className="flex items-start justify-between gap-3 mb-4">
				<IconTile icon={Icon} tone={TONE_MAP[tone]} size="md" />
				{onEdit && (
					<button
						type="button"
						onClick={onEdit}
						aria-label={`Ubah ${label}`}
						className="p-2 rounded-xl text-neutral/40 hover:text-neutral hover:bg-slate-100 transition cursor-pointer">
						<Pencil size={14} />
					</button>
				)}
			</div>
			<div>
				<p className="text-xs font-bold text-neutral/55 tracking-wide uppercase mb-1">
					{label}
				</p>
				<p className="num-display text-xl sm:text-2xl text-neutral">{value}</p>
				{sublabel && (
					<p className="text-xs font-medium text-neutral/60 mt-1.5">
						{sublabel}
					</p>
				)}
			</div>
		</Card>
	);
}
