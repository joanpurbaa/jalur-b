import { ArrowDownRight, ArrowUpRight, ShieldCheck, Sparkles, Target } from "lucide-react";
import { getRunwayStatus } from "../../lib/status";
import { formatDecimal1 } from "../../lib/format";
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
				? "Aman · Di Atas Target"
				: variant === "warning"
					? "Mendekati Target"
					: "Area untuk Diperkuat";

	const description =
		runway?.description ??
		"Lengkapi parameter pengeluaran dan tabungan untuk menghitung ketahanan keuanganmu.";

	return (
		<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 items-stretch">
			<Card
				padding="lg"
				className="lg:col-span-7 bg-gradient-to-br from-white via-emerald-50/45 to-teal-50/35 flex flex-col justify-between">
				<div>
					<div className="flex flex-wrap items-center justify-between gap-2.5 mb-4">
						<div className="inline-flex items-center gap-2.5">
							<IconTile icon={ShieldCheck} tone="finansial" size="sm" />
							<span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
								Ketahanan Finansial · Runway
							</span>
						</div>
						<StatusBadge label={statusLabel} variant={variant} />
					</div>

					<div className="flex items-baseline gap-2.5 mt-2">
						<span className="num-display text-5xl sm:text-6xl text-neutral">
							<CountUp
								value={current}
								decimals={1}
								format={(n) => formatDecimal1(n)}
							/>
						</span>
						<span className="text-lg sm:text-xl text-neutral/55 font-bold">
							bulan napas finansial
						</span>
					</div>

					<p className="text-sm sm:text-[15px] text-neutral/75 mt-3 leading-relaxed max-w-xl">
						{description}
					</p>
				</div>

				{/* Visual Bar / Tangki Runway berskala bulan dengan penanda target */}
				<div className="mt-6 pt-5 border-t border-emerald-100/80">
					<div className="flex items-center justify-between text-xs font-bold text-neutral/65 mb-2">
						<span>0 bln</span>
						<span className="inline-flex items-center gap-1 text-slate-800">
							<Target size={12} className="text-emerald-600" />
							Target: {formatDecimal1(target)} bln
						</span>
						<span>{formatDecimal1(maxScale)} bln</span>
					</div>
					<MeterBar
						value={current}
						max={maxScale}
						target={target}
						targetLabel="Target minimum"
						status={variant}
						height="lg"
						showTicks
						ariaLabel={`Runway saat ini ${formatDecimal1(current)} bulan dari target ${formatDecimal1(target)} bulan`}
					/>
				</div>
			</Card>

			<Card
				padding="lg"
				className={`lg:col-span-5 flex flex-col justify-between ${
					variant === "healthy"
						? "bg-gradient-to-br from-emerald-50/80 via-white to-green-50/60"
						: variant === "warning"
							? "bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50"
							: "bg-gradient-to-br from-rose-50/70 via-white to-orange-50/40"
				}`}>
				<div>
					<div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-neutral/55 mb-4">
						<Sparkles size={14} className="text-emerald-600" />
						<span>Perbandingan Terhadap Target</span>
					</div>

					<div className="grid grid-cols-2 gap-3 mb-5">
						<div className="rounded-2xl bg-white/90 border border-slate-200/80 p-3.5">
							<p className="text-[11px] font-bold uppercase tracking-wider text-neutral/50">
								Kondisi Saat Ini
							</p>
							<p className="num-display text-2xl text-neutral mt-1">
								{formatDecimal1(current)}{" "}
								<span className="text-xs font-semibold text-neutral/50">
									bln
								</span>
							</p>
						</div>

						<div className="rounded-2xl bg-white/90 border border-slate-200/80 p-3.5">
							<p className="text-[11px] font-bold uppercase tracking-wider text-neutral/50">
								Target Minimum
							</p>
							<p className="num-display text-2xl text-neutral mt-1">
								{formatDecimal1(target)}{" "}
								<span className="text-xs font-semibold text-neutral/50">
									bln
								</span>
							</p>
						</div>
					</div>
				</div>

				<div
					className={`rounded-2xl p-4 border flex items-start gap-3 ${
						isSurplus
							? "bg-emerald-100/70 border-emerald-300 text-emerald-950"
							: variant === "warning"
								? "bg-amber-100/70 border-amber-300 text-amber-950"
								: "bg-rose-100/70 border-rose-300 text-rose-950"
					}`}>
					{isSurplus ? (
						<ArrowUpRight size={20} className="text-emerald-700 shrink-0 mt-0.5" />
					) : (
						<ArrowDownRight
							size={20}
							className={
								variant === "warning"
									? "text-amber-700 shrink-0 mt-0.5"
									: "text-rose-700 shrink-0 mt-0.5"
							}
						/>
					)}
					<div>
						<p className="text-sm font-extrabold">
							{isSurplus
								? `Surplus +${formatDecimal1(Math.abs(diff))} bulan di atas target`
								: `Selisih ${formatDecimal1(Math.abs(diff))} bulan menuju target`}
						</p>
						<p className="text-xs opacity-80 mt-0.5 leading-relaxed">
							{isSurplus
								? "Dana daruratmu sudah melampaui batas aman minimum. Kamu punya ruang bernapas yang lega."
								: "Tambahkan dana likuid secara bertahap atau sesuaikan pengeluaran bulanan untuk memperpanjang runway."}
						</p>
					</div>
				</div>
			</Card>
		</div>
	);
}
