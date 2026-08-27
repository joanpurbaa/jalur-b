import { Lock } from "lucide-react";
import PageHeader from "../layouts/PageHeader";
import FinancialRunwayHero from "./FinancialRunwayHero";
import FinancialParameters from "./FinancialParameters";

export default function Finansial() {
	return (
		<div>
			<PageHeader
				title="Finansial"
				subtitle="Pahami kesiapan finansialmu jika sewaktu-waktu kehilangan income."
			/>

			<FinancialRunwayHero />
			<FinancialParameters />

			<div className="flex items-center justify-center gap-2 mt-10 pt-6 border-t border-neutral/10">
				<Lock size={12} className="text-neutral/40" />
				<p className="text-xs text-neutral/50">
					Data finansialmu bersifat privat dan hanya digunakan untuk menghitung
					financial runway.
				</p>
			</div>
		</div>
	);
}
