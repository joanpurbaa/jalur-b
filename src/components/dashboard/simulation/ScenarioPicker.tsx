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

const EXIT_ICON: Record<ExitType, LucideIcon> = {
	efficiency_due_to_loss: TrendingDown,
	efficiency_prevent_loss: ShieldAlert,
	closure_not_loss: Building2,
	bankruptcy: Scale,
	pkwt_ends_on_schedule: CalendarCheck2,
	resign: DoorOpen,
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
	const needsLegalDisputeNote =
		selected === "efficiency_due_to_loss" || selected === "bankruptcy";

	return (
		<div className="space-y-3.5">
			<div
				role="radiogroup"
				aria-label="Pilih skenario pemutusan hubungan kerja"
				className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
				{options.map((option) => {
					const active = option.id === selected;
					const Icon = EXIT_ICON[option.id] ?? TrendingDown;
					return (
						<button
							key={option.id}
							type="button"
							role="radio"
							aria-checked={active}
							onClick={() => onSelect(option.id)}
							className={`rounded-xl p-4 text-left transition border cursor-pointer flex items-start gap-3.5 ${
								active
									? "border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-500/25"
									: "border-slate-200 bg-white hover:border-indigo-200"
							}`}>
							<IconTile icon={Icon} tone="indigo" size="sm" />
							<div className="flex-1 min-w-0">
								<div className="flex items-center justify-between gap-2">
									<p className="text-sm font-bold text-slate-900">
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
									<span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-slate-100 text-xs font-medium text-slate-700">
										{option.badge}
									</span>
								)}
								<p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
									{option.description}
								</p>
							</div>
						</button>
					);
				})}
			</div>

			{needsLegalDisputeNote && (
				<div className="rounded-xl border border-amber-200/90 bg-amber-50/70 px-4 py-3 flex items-start gap-3 text-xs text-amber-950">
					<Scale size={16} className="text-amber-700 shrink-0 mt-0.5" />
					<div>
						<p className="font-bold text-amber-950">
							Hak bisa disengketakan, konsultasi Disnaker/LBH.
						</p>
						<p className="text-amber-900/85 mt-0.5 leading-relaxed">
							Pada PHK efisiensi karena rugi atau kepailitan, pembuktian kondisi
							keuangan perusahaan dan nilai pesangon sering menjadi sengketa.
							Simpan kontrak kerja, slip gaji, dan surat PHK sebelum menandatangani
							perjanjian bersama.
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
