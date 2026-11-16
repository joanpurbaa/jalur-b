import { ArrowDownRight, ArrowUpRight, ShieldCheck, Target } from "lucide-react";
import { getRunwayStatus } from "../../lib/status";
import { formatDecimal1, formatMonths } from "../../lib/format";
import MeterBar from "../ui/MeterBar";
import StatusBadge from "../ui/StatusBadge";
import IconTile from "../ui/IconTile";
import Card from "../ui/Card";
import { CountUp } from "../ui/Motion";
import { SkeletonHero } from "../ui/Skeleton";

interface RunwayData {
	current: number;
	target: number;
	description?: string | null;
}

interface FinancialRunwayHeroProps {
	runway?: RunwayData | null;
	loading?: boolean;
}

export default function FinancialRunwayHero({
	runway,
	loading = false,
}: FinancialRunwayHeroProps) {
	if (loading) {
		return <SkeletonHero className="mb-8" />;
	}

	const current = runway?.current ?? 0;
	const target = runway?.target && runway.target > 0 ? runway.target : 6;
	const variant = getRunwayStatus(current, target);
	const diff = current - target;
	const isSurplus = diff >= 0;
	const maxScale = Math.max(target * 1.4, current * 1.15, 12);

	const statusLabel =
		current <= 0
			? "Belum dihitung"
			: variant === "healthy"
				? "Di atas target"
				: variant === "warning"
					? "Mendekati target"
					: "Di bawah target";

	const description =
		runway?.description ??
		"Lengkapi parameter pengeluaran dan tabungan untuk menghitung ketahanan keuanganmu.";

	return (
		<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 items-stretch">
			<Card variant="hero" padding="lg" className="lg:col-span-7 flex flex-col justify-between">
				<div>
					<div className="flex flex-wrap items-center justify-between gap-2.5 mb-4">
						<div className="inline-flex items-center gap-2.5">
							<IconTile icon={ShieldCheck} tone="indigo" size="sm" />
							<span className="text-sm font-semibold text-slate-700">
								Ketahanan Finansial (Runway)
							</span>
						</div>
						<StatusBadge label={statusLabel} variant={variant} />
					</div>

					<div className="flex items-baseline gap-2.5 mt-2">
						<span className="num-display text-5xl sm:text-6xl text-slate-900">
							<CountUp
								value={current}
								decimals={1}
								format={(n) => formatDecimal1(n)}
							/>
						</span>
						<span className="text-lg sm:text-xl text-slate-500 font-semibold">
							bln
						</span>
					</div>

					<p className="text-sm text-slate-600 mt-3 leading-relaxed max-w-xl">
						{description}
					</p>
				</div>

				{/* Visual Bar berskala bulan dengan garis penanda target */}
				<div className="mt-6 pt-5 border-t border-slate-200/70">
					<div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
						<span>0 bln</span>
						<span className="inline-flex items-center gap-1 text-slate-800 font-semibold">
							<Target size={12} className="text-slate-600" />
							Target: {formatMonths(target)}
						</span>
						<span>{formatMonths(maxScale)}</span>
					</div>
					<MeterBar
						value={current}
						max={maxScale}
						target={target}
						targetLabel="Target minimum"
						status={variant}
						height="lg"
						showTicks
						ariaLabel={`Runway saat ini ${formatMonths(current)} dari target ${formatMonths(target)}`}
					/>
				</div>
			</Card>

			<Card padding="lg" className="lg:col-span-5 flex flex-col justify-between">
				<div>
					<p className="text-xs font-semibold text-slate-500 mb-4">
						Perbandingan Terhadap Target Minimum
					</p>

					<div className="grid grid-cols-2 gap-3 mb-5">
						<div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5">
							<p className="text-xs font-medium text-slate-500">
								Kondisi Saat Ini
							</p>
							<p className="num-display text-2xl text-slate-900 mt-1">
								{formatMonths(current)}
							</p>
						</div>

						<div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5">
							<p className="text-xs font-medium text-slate-500">
								Target Minimum
							</p>
							<p className="num-display text-2xl text-slate-900 mt-1">
								{formatMonths(target)}
							</p>
						</div>
					</div>
				</div>

				<div
					className={`rounded-xl p-4 border flex items-start gap-3 ${
						isSurplus
							? "bg-emerald-50/80 border-emerald-200/80 text-emerald-950"
							: variant === "warning"
								? "bg-amber-50/80 border-amber-200/80 text-amber-950"
								: "bg-rose-50/80 border-rose-200/80 text-rose-950"
					}`}>
					{isSurplus ? (
						<ArrowUpRight
							size={18}
							className="text-emerald-700 shrink-0 mt-0.5"
						/>
					) : (
						<ArrowDownRight
							size={18}
							className={
								variant === "warning"
									? "text-amber-700 shrink-0 mt-0.5"
									: "text-rose-700 shrink-0 mt-0.5"
							}
						/>
					)}
					<div>
						<p className="text-sm font-bold">
							{isSurplus
								? `Surplus +${formatMonths(Math.abs(diff))} di atas target`
								: `Selisih ${formatMonths(Math.abs(diff))} menuju target`}
						</p>
						<p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
							{isSurplus
								? "Dana daruratmu sudah melampaui batas aman minimum. Kamu punya ruang bernapas yang cukup."
								: "Tambahkan dana likuid secara bertahap atau sesuaikan pengeluaran rutin untuk memperpanjang runway."}
						</p>
					</div>
				</div>
			</Card>
		</div>
	);
}
