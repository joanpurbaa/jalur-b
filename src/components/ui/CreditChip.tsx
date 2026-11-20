import { Link } from "react-router-dom";
import { Coins, Plus } from "lucide-react";
import { useCredits } from "../../context/CreditsContext";

interface CreditChipProps {
	compact?: boolean;
}

/**
 * Chip saldo B-Credits di header aplikasi — satu warna brand indigo yang tenang.
 */
export default function CreditChip({ compact = false }: CreditChipProps) {
	const { balance, trialGranted } = useCredits();

	return (
		<Link
			to="/harga"
			title={
				trialGranted
					? `Saldo ${balance} B-Credits (termasuk trial 14 hari) · Klik untuk lihat paket & tarif`
					: `Saldo ${balance} B-Credits · Klik untuk lihat paket & tarif`
			}
			className="press inline-flex items-center gap-2 min-h-[36px] px-3 py-1.5 rounded-full bg-indigo-50/90 hover:bg-indigo-100 border border-indigo-200/80 text-indigo-800 transition">
			<span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white shrink-0">
				<Coins size={11} strokeWidth={2.2} />
			</span>
			<span className="text-xs font-bold tabular whitespace-nowrap">
				{balance} <span className="font-semibold text-indigo-700/90">credit</span>
			</span>
			{!compact && (
				<span className="hidden sm:inline-flex items-center gap-0.5 pl-1.5 ml-0.5 border-l border-indigo-200 text-[11px] font-semibold text-indigo-700">
					<Plus size={11} strokeWidth={2.5} />
					Paket
				</span>
			)}
		</Link>
	);
}
