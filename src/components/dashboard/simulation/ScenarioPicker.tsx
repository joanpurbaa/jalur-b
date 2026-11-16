import {
	Building2,
	CalendarCheck2,
	CheckCircle2,
	DoorOpen,
	Scale,
	ShieldAlert,
	TrendingDown,
	type LucideIcon,
} from "lucide-react";
import type { ExitType } from "../../../types/layoffSimulation";
import type { Tone } from "../../../lib/modules";
import IconTile from "../../ui/IconTile";

export interface ExitTypeOption {
	id: ExitType;
	label: string;
	description: string;
	badge?: string;
}

// eslint-disable-next-line react-refresh/only-export-components
export const exitTypeOptions: ExitTypeOption[] = [
	{
		id: "efficiency_due_to_loss",
		label: "Efisiensi (Rugi)",
		description: "PHK efisiensi karena perusahaan mengalami kerugian finansial.",
		badge: "0,5x UP + UPMK",
	},
	{
		id: "efficiency_prevent_loss",
		label: "Efisiensi (Cegah Rugi)",
		description: "PHK efisiensi preventif guna mencegah potensi kerugian.",
		badge: "1x UP + UPMK",
	},
	{
		id: "closure_not_loss",
		label: "Penutupan Usaha",
		description: "Operasional perusahaan ditutup bukan karena kondisi merugi.",
		badge: "1x UP + UPMK",
	},
	{
		id: "bankruptcy",
		label: "Kepailitan",
		description: "Perusahaan dinyatakan pailit oleh putusan pengadilan.",
		badge: "0,5x UP + UPMK",
	},
	{
		id: "pkwt_ends_on_schedule",
		label: "PKWT Berakhir",
		description: "Masa perjanjian kerja waktu tertentu (kontrak) telah selesai.",
		badge: "Uang Kompensasi",
	},
	{
		id: "resign",
		label: "Resign Sukarela",
		description: "Pengunduran diri sukarela atas inisiatif pribadi.",
		badge: "UPH + Uang Pisah",
	},
];

const EXIT_VISUAL: Record<ExitType, { icon: LucideIcon; tone: Tone }> = {
	efficiency_due_to_loss: { icon: TrendingDown, tone: "danger" },
	efficiency_prevent_loss: { icon: ShieldAlert, tone: "caution" },
	closure_not_loss: { icon: Building2, tone: "indigo" },
	bankruptcy: { icon: Scale, tone: "violet" },
	pkwt_ends_on_schedule: { icon: CalendarCheck2, tone: "teal" },
	resign: { icon: DoorOpen, tone: "simulasi" },
};

interface ExitTypePickerProps {
	selected: ExitType;
	options?: ExitTypeOption[];
	onSelect: (id: ExitType) => void;
}

export default function ExitTypePicker({
	selected,
	options = exitTypeOptions,
	onSelect,
}: ExitTypePickerProps) {
	return (
		<div
			role="radiogroup"
			aria-label="Pilih skenario pemutusan hubungan kerja"
			className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
			{options.map((option) => {
				const active = option.id === selected;
				const vis = EXIT_VISUAL[option.id] ?? EXIT_VISUAL.efficiency_due_to_loss;
				return (
					<button
						key={option.id}
						type="button"
						role="radio"
						aria-checked={active}
						onClick={() => onSelect(option.id)}
						className={`press rounded-2xl p-4 text-left transition border-2 cursor-pointer flex items-start gap-3.5 ${
							active
								? "border-indigo-600 bg-indigo-50/60 shadow-[0_12px_26px_-12px_rgba(79,70,229,0.35)] ring-2 ring-indigo-500/20"
								: "border-slate-200/85 bg-white/90 hover:bg-white hover:border-indigo-200"
						}`}>
						<IconTile icon={vis.icon} tone={vis.tone} size="sm" />
						<div className="flex-1 min-w-0">
							<div className="flex items-center justify-between gap-2">
								<p className="text-sm font-extrabold text-neutral">
									{option.label}
								</p>
								{active && (
									<CheckCircle2
										size={16}
										className="text-indigo-600 shrink-0"
									/>
								)}
							</div>
							{option.badge && (
								<span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-700">
									{option.badge}
								</span>
							)}
							<p className="text-xs text-neutral/65 mt-1.5 leading-relaxed">
								{option.description}
							</p>
						</div>
					</button>
				);
			})}
		</div>
	);
}
