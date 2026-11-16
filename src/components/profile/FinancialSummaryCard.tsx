import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Lock } from "lucide-react";
import { financialApi, parseRunwayMonths } from "../../services/financial";
import type { FinancialProfileResponse } from "../../types/financial";
import { getRunwayStatus, statusStyles } from "../../lib/status";
import { formatDecimal1, formatRupiah } from "../../lib/format";
import MeterBar from "../ui/MeterBar";
import StatusBadge from "../ui/StatusBadge";
import Skeleton from "../ui/Skeleton";

interface FinancialSummaryCardProps {
	refreshKey?: number;
}

export default function FinancialSummaryCard({
	refreshKey = 0,
}: FinancialSummaryCardProps) {
	const [profile, setProfile] = useState<FinancialProfileResponse | null>(null);
	const [runway, setRunway] = useState<{
		current: number;
		target: number;
	} | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;
		financialApi
			.getOrCreate()
			.then((res) => {
				if (!active) return;
				setProfile(res.profile ?? null);
				setRunway(res.runway ? parseRunwayMonths(res.runway) : null);
			})
			.catch(() => {
				if (!active) return;
				setProfile(null);
				setRunway(null);
			})
			.finally(() => {
				if (active) setLoading(false);
			});
		return () => {
			active = false;
		};
	}, [refreshKey]);

	const current = runway?.current ?? 0;
	const target = runway?.target && runway.target > 0 ? runway.target : 6;
	const variant = getRunwayStatus(current, target);
	const s = statusStyles[variant];

	const parameters =
		profile != null
			? [
					{
						label: "Pengeluaran Esensial / Bulan",
						value: formatRupiah(profile.monthly_essential_expenses),
					},
					{
						label: "Cicilan Utang / Bulan",
						value: formatRupiah(profile.monthly_debt_payment),
					},
					{
						label: "Jumlah Tanggungan",
						value:
							profile.dependents != null
								? `${profile.dependents} orang`
								: "0 orang",
					},
				]
			: [];

	return (
		<div>
			{loading ? (
				<div className="rounded-2xl p-5 mb-5 bg-slate-50 border border-slate-200">
					<Skeleton className="h-3 w-24 mb-2" />
					<Skeleton className="h-8 w-32 mb-3" />
					<Skeleton className="h-3 w-full" />
				</div>
			) : (
				<div className={`rounded-2xl p-5 mb-5 ${s.bg} border ${s.border}`}>
					<div className="flex items-start justify-between gap-2 mb-3">
						<div>
							<p className="text-[11px] font-bold text-neutral/55 uppercase tracking-wide">
								Runway Saat Ini
							</p>
							<p className="num-display text-2xl text-neutral mt-0.5">
								{formatDecimal1(current)} bulan
							</p>
						</div>
						<div className="text-right">
							<StatusBadge
								variant={variant}
								label={`Target ${formatDecimal1(target)} bln`}
								size="sm"
							/>
						</div>
					</div>
					<MeterBar
						value={current}
						max={Math.max(target * 1.3, current * 1.1, 12)}
						target={target}
						status={variant}
						height="md"
					/>
				</div>
			)}

			{parameters.length > 0 && (
				<div className="divide-y divide-slate-100 border-t border-slate-100 mb-4">
					{parameters.map((item) => (
						<div
							key={item.label}
							className="flex items-center justify-between py-2.5">
							<span className="text-xs sm:text-sm text-neutral/65">
								{item.label}
							</span>
							<span className="text-xs sm:text-sm font-extrabold text-neutral tabular">
								{item.value}
							</span>
						</div>
					))}
				</div>
			)}

			<div className="flex items-center gap-2 mb-4">
				<Lock size={12} className="text-emerald-600 shrink-0" />
				<p className="text-xs text-neutral/55">
					Data finansialmu bersifat privat dan terenkripsi.
				</p>
			</div>

			<Link
				to="/dashboard/finansial"
				className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 hover:text-emerald-800 transition">
				Kelola Data Finansial
				<ArrowRight size={13} />
			</Link>
		</div>
	);
}
