import {
	AlertTriangle,
	Sparkles,
	TrendingDown,
	HeartPulse,
	Zap,
	Compass,
	Wallet as WalletIcon,
} from "lucide-react";
import { simulationData } from "../../../data/dashboardDummyData";
import { getScoreStatus } from "../../../lib/status";
import MetricCard from "../MetricCard";
import ProgressBar from "../../ui/ProgressBar";
import ResultTimeline from "./ResultTimeline";

const readinessIcons = { Wallet: WalletIcon, HeartPulse, Zap, Compass };

export default function SimulationResult() {
	const { result } = simulationData;
	const runwayPercent = Math.min(
		100,
		Math.round((result.runwayMonths / result.targetMonths) * 100),
	);

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<div className="lg:col-span-2 space-y-6">
				<div className="bg-white rounded-2xl border border-rose-100 shadow-md p-8">
					<p className="text-[11px] font-semibold text-neutral/50 uppercase tracking-wide mb-2">
						Financial Runway
					</p>
					<div className="flex items-start justify-between gap-4 mb-4">
						<h3 className="text-lg font-bold text-neutral max-w-md leading-snug">
							Kamu punya waktu sekitar{" "}
							<span className="text-rose-600">{result.runwayMonths} bulan</span>{" "}
							sebelum dana cadangan habis.
						</h3>
						<div className="text-right shrink-0">
							<span className="text-4xl font-extrabold text-rose-600">
								{result.runwayMonths.toString().replace(".", ",")}
							</span>
							<p className="text-xs text-neutral/50">bulan</p>
						</div>
					</div>
					<div className="flex justify-between text-[11px] text-neutral/40 mb-1.5">
						<span>0</span>
						<span>Target: {result.targetMonths.toFixed(1)} bulan</span>
					</div>
					<ProgressBar value={runwayPercent} variant="risk" />
					<div className="flex items-center gap-1.5 mt-3">
						<AlertTriangle size={13} className="text-rose-600" />
						<span className="text-xs font-semibold text-rose-600">
							Perlu diperkuat
						</span>
					</div>
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
					{result.readiness.map((item) => {
						const Icon = readinessIcons[item.icon as keyof typeof readinessIcons];
						return (
							<MetricCard
								key={item.label}
								label={item.label}
								value={`${item.value}/100`}
								icon={Icon}
								variant={getScoreStatus(item.value)}
							/>
						);
					})}
				</div>

				<ResultTimeline />
			</div>

			<div className="space-y-6">
				<div className="bg-primary/5 rounded-2xl border border-primary/20 border-l-4 border-l-primary p-6">
					<div className="flex items-center gap-2 text-primary font-bold text-sm mb-4">
						<Sparkles size={16} />
						<span>Kalau kamu mencari kerja lagi</span>
					</div>
					<p className="text-xs text-neutral/60 mb-4">
						Opsi pivot karier terkuat berdasarkan profilmu:
					</p>
					<div className="space-y-2.5">
						{result.pivotOptions.map((option) => (
							<div
								key={option.role}
								className="bg-white rounded-xl p-3.5 flex items-center justify-between">
								<span className="text-sm font-semibold text-neutral">
									{option.role}
								</span>
								<span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
									{option.match}% Match
								</span>
							</div>
						))}
					</div>
				</div>

				<div className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-6">
					<h4 className="text-sm font-bold text-neutral mb-4">
						Apa yang perlu diperkuat?
					</h4>
					<div className="space-y-3">
						{result.weaknesses.map((item) => (
							<div key={item.skill} className="flex items-start gap-2.5">
								<TrendingDown size={15} className="text-rose-500 shrink-0 mt-0.5" />
								<div>
									<p className="text-sm font-semibold text-neutral">{item.skill}</p>
									<p className="text-xs text-rose-500">{item.gap}</p>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-6">
					<h4 className="text-sm font-bold text-neutral mb-2">
						Seberapa siap kamu membuktikan kemampuanmu?
					</h4>
					<p className="text-sm text-neutral/60">
						Kamu memiliki{" "}
						<span className="font-bold text-primary">
							{result.evidenceCount} bukti tersimpan
						</span>
						.
					</p>
				</div>
			</div>

			<div className="lg:col-span-3 bg-white rounded-2xl border border-neutral/5 shadow-sm p-8 text-center">
				<h3 className="text-xl font-bold text-neutral mb-2">
					PHK mungkin tidak bisa kamu prediksi.
				</h3>
				<p className="text-sm text-neutral/60">
					Tapi kamu bisa mempersiapkan apa yang terjadi setelahnya.
				</p>
			</div>
		</div>
	);
}
