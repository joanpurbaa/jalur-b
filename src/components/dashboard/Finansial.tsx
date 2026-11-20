import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
	ArrowRight,
	CalendarRange,
	Lock,
	Wallet,
} from "lucide-react";
import PageHeader from "../layouts/PageHeader";
import FinancialRunwayHero from "./FinancialRunwayHero";
import FinancialProfileCard from "./FinancialProfileCard";
import FinancialParameters from "./FinancialParameters";
import Card from "../ui/Card";
import IconTile from "../ui/IconTile";
import LockedPreviewCard from "../ui/LockedPreviewCard";
import { PrimaryButton } from "../ui/PrimaryButton";
import { financialApi, parseRunwayMonths } from "../../services/financial";
import { loadManualCache, saveManualCache } from "../../lib/manualCache";
import { formatMonths, formatMonthsLong, formatRupiah } from "../../lib/format";
import { parseDecimal } from "../../lib/parseNumeric";
import type { FinancialRunwayPreview } from "../../types/financial";

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

const DUMMY_MONTHLY_ROWS = [
	{ month: 1, remaining: 38_500_000, pct: 84, zone: "Aman" },
	{ month: 2, remaining: 31_000_000, pct: 68, zone: "Aman" },
	{ month: 3, remaining: 23_500_000, pct: 52, zone: "Aman" },
	{ month: 4, remaining: 16_000_000, pct: 35, zone: "Evaluasi" },
	{ month: 5, remaining: 8_500_000, pct: 18, zone: "Batas Dana" },
	{ month: 6, remaining: 1_000_000, pct: 4, zone: "Batas Dana" },
];

export default function Finansial() {
	const cachedFin = loadManualCache<FinancialRunwayPreview>("financial");
	const [runway, setRunway] = useState<{
		current: number;
		target: number;
	} | null>(() => (cachedFin?.data ? parseRunwayMonths(cachedFin.data) : null));
	const [rawRunway, setRawRunway] = useState<FinancialRunwayPreview | null>(
		() => cachedFin?.data ?? null,
	);
	const [loading, setLoading] = useState(() => !cachedFin?.data);

	const refresh = useCallback(async () => {
		try {
			const res = await financialApi.getOrCreate();
			setRunway(parseRunwayMonths(res.runway));
			setRawRunway(res.runway ?? null);
			if (res.runway) saveManualCache("financial", res.runway);
			setLoading(false);
		} catch {
			setRunway(null);
			setRawRunway(null);
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		let active = true;
		financialApi
			.getOrCreate()
			.then((res) => {
				if (active) {
					setRunway(parseRunwayMonths(res.runway));
					setRawRunway(res.runway ?? null);
					if (res.runway) saveManualCache("financial", res.runway);
				}
			})
			.catch(() => {
				if (active && !cachedFin?.data) {
					setRunway(null);
					setRawRunway(null);
				}
			})
			.finally(() => {
				if (active) setLoading(false);
			});
		return () => {
			active = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const description = runway
		? runwayDescription(runway.current, runway.target)
		: null;

	const liquidAssets = rawRunway ? parseDecimal(rawRunway.liquid_assets) : 0;
	const monthlyBurn = rawRunway ? parseDecimal(rawRunway.monthly_burn) : 0;

	const monthlyRows = (() => {
		if (liquidAssets <= 0 || monthlyBurn <= 0) return [];
		const totalMonths = Math.min(Math.max(1, Math.ceil(liquidAssets / monthlyBurn)), 12);
		return Array.from({ length: totalMonths }, (_, i) => {
			const month = i + 1;
			const remaining = Math.max(0, liquidAssets - month * monthlyBurn);
			const pct = Math.max(0, Math.min(100, Math.round((remaining / liquidAssets) * 100)));
			const zone =
				pct >= 50 ? "Aman" : pct >= 20 ? "Evaluasi" : "Batas Dana";
			return { month, remaining, pct, zone };
		});
	})();

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

			{/* P1 #7: Proyeksi Runway per Bulan (1 credit) — data dummy saat locked, data real saat unlocked */}
			{!loading && monthlyRows.length > 0 && (
				<LockedPreviewCard
					featureId="monthly_runway_projection"
					title="Proyeksi Runway per Bulan"
					subtitle={`Simulasi penyusutan dana likuid (${formatRupiah(liquidAssets)}) dengan beban bulanan ${formatRupiah(monthlyBurn)}/bln`}
					icon={CalendarRange}
					className="mb-8"
					previewMaxHeight="max-h-[198px]"
					lockedHint="Contoh pratinjau · Beli credit untuk proyeksi bulanan aslimu"
					lockedPreview={
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
							{DUMMY_MONTHLY_ROWS.map((row) => (
								<div
									key={`dummy-month-${row.month}`}
									className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-2">
									<div className="flex items-center justify-between gap-2 text-xs">
										<span className="font-bold text-slate-900">
											Bulan ke-{row.month}
										</span>
										<span
											className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
												row.zone === "Aman"
													? "bg-emerald-50 text-emerald-800 border-emerald-200"
													: row.zone === "Evaluasi"
														? "bg-amber-50 text-amber-800 border-amber-200"
														: "bg-rose-50 text-rose-800 border-rose-200"
											}`}>
											{row.zone}
										</span>
									</div>
									<p className="text-sm font-bold text-slate-900 tabular">
										{formatRupiah(row.remaining)}
									</p>
									<div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
										<div
											className={`h-full rounded-full ${
												row.zone === "Aman"
													? "bg-emerald-500"
													: row.zone === "Evaluasi"
														? "bg-amber-500"
														: "bg-rose-500"
											}`}
											style={{ width: `${row.pct}%` }}
										/>
									</div>
								</div>
							))}
						</div>
					}>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
						{monthlyRows.map((row) => (
							<div
								key={row.month}
								className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-2">
								<div className="flex items-center justify-between gap-2 text-xs">
									<span className="font-bold text-slate-900">
										Bulan ke-{row.month}
									</span>
									<span
										className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
											row.zone === "Aman"
												? "bg-emerald-50 text-emerald-800 border-emerald-200"
												: row.zone === "Evaluasi"
													? "bg-amber-50 text-amber-800 border-amber-200"
													: "bg-rose-50 text-rose-800 border-rose-200"
										}`}>
										{row.zone}
									</span>
								</div>
								<p className="text-sm font-bold text-slate-900 tabular">
									{formatRupiah(row.remaining)}
								</p>
								<div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
									<div
										className={`h-full rounded-full ${
											row.zone === "Aman"
												? "bg-emerald-500"
												: row.zone === "Evaluasi"
													? "bg-amber-500"
													: "bg-rose-500"
										}`}
										style={{ width: `${row.pct}%` }}
									/>
								</div>
							</div>
						))}
					</div>
				</LockedPreviewCard>
			)}

			<FinancialProfileCard onChanged={refresh} />
			<FinancialParameters onChanged={refresh} />

			<Card
				padding="md"
				className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div className="flex items-start gap-3">
					<IconTile icon={Wallet} tone="indigo" size="sm" />
					<div>
						<h3 className="text-sm font-bold text-slate-900">
							Uji dengan Skenario Pesangon &amp; PHK
						</h3>
						<p className="text-sm text-slate-600 mt-0.5">
							Gabungkan angka runway ini dengan estimasi hak normatif PP 35/2021
							&amp; PP 6/2025 di modul Simulasi.
						</p>
					</div>
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
