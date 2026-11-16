import type { ExitType } from "../../../types/layoffSimulation";

export interface ExitTypeOption {
	id: ExitType;
	label: string;
	description: string;
}

// eslint-disable-next-line react-refresh/only-export-components
export const exitTypeOptions: ExitTypeOption[] = [
	{
		id: "efficiency_due_to_loss",
		label: "Efisiensi (Rugi)",
		description: "PHK efisiensi karena perusahaan mengalami kerugian finansial.",
	},
	{
		id: "efficiency_prevent_loss",
		label: "Efisiensi (Cegah Rugi)",
		description: "PHK efisiensi preventif guna mencegah potensi kerugian.",
	},
	{
		id: "closure_not_loss",
		label: "Penutupan Usaha",
		description: "Operasional perusahaan ditutup bukan karena kondisi merugi.",
	},
	{
		id: "bankruptcy",
		label: "Kepailitan",
		description: "Perusahaan dinyatakan pailit oleh putusan pengadilan.",
	},
	{
		id: "pkwt_ends_on_schedule",
		label: "PKWT Berakhir",
		description: "Masa perjanjian kerja waktu tertentu (kontrak) telah selesai.",
	},
	{
		id: "resign",
		label: "Resign Sukarela",
		description: "Pengunduran diri sukarela atas inisiatif pribadi.",
	},
];

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
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
			{options.map((option) => {
				const active = option.id === selected;
				return (
					<button
						key={option.id}
						type="button"
						onClick={() => onSelect(option.id)}
						className={`rounded-xl p-4 text-left transition border-2 cursor-pointer ${
							active
								? "border-primary bg-white shadow-sm ring-2 ring-primary/20"
								: "border-transparent bg-white/70 hover:bg-white"
						}`}>
						<div className="flex items-center justify-between">
							<p className="text-sm font-bold text-neutral">{option.label}</p>
							{active && (
								<span className="w-2 h-2 rounded-full bg-primary" />
							)}
						</div>
						<p className="text-xs text-neutral/60 mt-1 leading-relaxed">
							{option.description}
						</p>
					</button>
				);
			})}
		</div>
	);
}
