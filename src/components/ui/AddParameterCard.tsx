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
			className="press rounded-3xl border-2 border-dashed border-emerald-300/90 bg-emerald-50/40 hover:bg-emerald-50/80 hover:border-emerald-500 p-6 flex flex-col items-center justify-center text-center gap-2.5 transition h-full min-h-[156px] cursor-pointer">
			<IconTile icon={Plus} tone="finansial" size="md" />
			<div>
				<p className="text-sm font-extrabold text-emerald-950">
					+ Tambah Aset / Tabungan
				</p>
				<p className="text-xs text-neutral/60 mt-0.5">
					Tabungan utama, dana darurat, deposito, atau investasi
				</p>
			</div>
		</button>
	);
}
