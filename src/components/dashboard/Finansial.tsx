import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Lock } from "lucide-react";
import PageHeader from "../layouts/PageHeader";
import FinancialRunwayHero from "./FinancialRunwayHero";
import FinancialProfileCard from "./FinancialProfileCard";
import FinancialParameters from "./FinancialParameters";
import Card from "../ui/Card";
import { PrimaryButton } from "../ui/PrimaryButton";
import { financialApi, parseRunwayMonths } from "../../services/financial";
import { formatMonths, formatMonthsLong } from "../../lib/format";

function runwayDescription(current: number, target: number): string {
	if (current <= 0)
		return "Lengkapi parameter pengeluaran dan tabungan di bawah untuk melihat berapa bulan dana cadanganmu mampu menopang hidup.";
	const gap = target - current;
	if (gap <= 0)
		return `Kamu masih punya waktu ${formatMonthsLong(current)} napas finansial — sudah di atas target minimum ${formatMonths(target)}. Pertahankan kebiasaan baik ini.`;
	return `Kamu punya waktu ${formatMonthsLong(
		current,
	)} napas finansial saat ini. Mari tambah cadangan sekitar ${formatMonths(
		gap,
	)} lagi untuk mencapai target minimum ${formatMonths(target)}.`;
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
				subtitle="Ketahui berapa bulan dana cadanganmu cukup menutup kebutuhan jika pemasukan berhenti sementara."
			/>

			<FinancialRunwayHero
				runway={runway ? { ...runway, description } : null}
				loading={loading}
			/>
			<FinancialProfileCard onChanged={refresh} />
			<FinancialParameters onChanged={refresh} />

			<Card
				padding="md"
				className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h3 className="text-sm font-bold text-slate-900">
						Uji dengan Skenario Pesangon & PHK
					</h3>
					<p className="text-sm text-slate-600 mt-0.5">
						Gabungkan angka runway ini dengan estimasi hak normatif di modul
						Simulasi.
					</p>
				</div>
				<Link to="/dashboard/simulasi" className="shrink-0">
					<PrimaryButton icon={<ArrowRight size={15} />}>
						Buka Simulasi
					</PrimaryButton>
				</Link>
			</Card>

			<div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-slate-200">
				<Lock size={13} className="text-slate-400" />
				<p className="text-xs text-slate-500">
					Data finansialmu bersifat privat dan hanya digunakan untuk menghitung
					ketahanan financial runway.
				</p>
			</div>
		</div>
	);
}
