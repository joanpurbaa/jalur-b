import { Plus } from "lucide-react";
import IconTile from "./IconTile";

interface AddParameterCardProps {
	onClick?: () => void;
}

export default function AddParameterCard({ onClick }: AddParameterCardProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="press rounded-2xl border border-dashed border-slate-300 bg-white/70 hover:bg-white hover:border-indigo-400 p-6 flex flex-col items-center justify-center text-center gap-2.5 transition h-full min-h-[156px] cursor-pointer">
			<IconTile icon={Plus} tone="indigo" size="md" />
			<div>
				<p className="text-sm font-semibold text-slate-900">
					Tambah aset atau tabungan
				</p>
				<p className="text-xs text-slate-500 mt-0.5">
					Tabungan utama, dana darurat, deposito, atau investasi
				</p>
			</div>
		</button>
	);
}
