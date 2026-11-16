import { useCallback, useEffect, useState } from "react";
import { Lock } from "lucide-react";
import PageHeader from "../layouts/PageHeader";
import FinancialRunwayHero from "./FinancialRunwayHero";
import FinancialProfileCard from "./FinancialProfileCard";
import FinancialParameters from "./FinancialParameters";
import { financialApi, parseRunwayMonths } from "../../services/financial";
import { formatDecimal1 } from "../../lib/format";

function runwayDescription(current: number, target: number): string {
	if (current <= 0)
		return "Lengkapi parameter pengeluaran dan tabungan di bawah untuk melihat berapa bulan dana cadanganmu mampu menopang hidup tenang.";
	const gap = target - current;
	if (gap <= 0)
		return `Kamu masih punya waktu ${formatDecimal1(current)} bulan napas finansial — sudah berada di atas target aman ${formatDecimal1(target)} bulan. Pertahankan kebiasaan baik ini!`;
	return `Kamu punya waktu ${formatDecimal1(
		current,
	)} bulan napas finansial saat ini. Mari tambah cadangan sekitar ${formatDecimal1(
		gap,
	)} bulan lagi agar mencapai target aman ${formatDecimal1(target)} bulan.`;
}

export default function Finansial() {
	const [runway, setRunway] = useState<{
		current: number;
		target: number;
	} | null>(null);
	const [loading, setLoading] = useState(true);

	const refresh = useCallback(async () => {
		try {
			const res = await financialApi.getOrCreate();
			setRunway(parseRunwayMonths(res.runway));
			setLoading(false);
		} catch {
			setRunway(null);
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		let active = true;
		financialApi
			.getOrCreate()
			.then((res) => {
				if (active) setRunway(parseRunwayMonths(res.runway));
			})
			.catch(() => {
				if (active) setRunway(null);
			})
			.finally(() => {
				if (active) setLoading(false);
			});
		return () => {
			active = false;
		};
	}, []);

	const description = runway
		? runwayDescription(runway.current, runway.target)
		: null;

	return (
		<div>
			<PageHeader
				title="Finansial"
				subtitle="Ketahui berapa bulan dana daruratmu siap menopang hidup tenang jika sewaktu-waktu terjadi transisi karier."
			/>

			<FinancialRunwayHero
				runway={runway ? { ...runway, description } : null}
				loading={loading}
			/>
			<FinancialProfileCard onChanged={refresh} />
			<FinancialParameters onChanged={refresh} />

			<div className="flex items-center justify-center gap-2 mt-10 pt-6 border-t border-slate-200/70">
				<Lock size={13} className="text-emerald-600" />
				<p className="text-xs font-medium text-neutral/60">
					Data finansialmu dienkripsi, bersifat privat, dan hanya digunakan
					untuk menghitung ketahanan financial runway-mu.
				</p>
			</div>
		</div>
	);
}
