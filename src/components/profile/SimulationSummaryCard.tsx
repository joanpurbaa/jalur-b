import { useEffect, useState } from "react";
import { ArrowRight, Wallet, HeartPulse, Zap, Compass } from "lucide-react";
import { getScoreStatus } from "../../lib/status";
import MetricCard from "../dashboard/MetricCard";
import Skeleton from "../ui/Skeleton";
import { layoffSimulationApi } from "../../services/layoffSimulation";
import { parseDecimal } from "../../lib/parseNumeric";
import type { LayoffSimulationResult } from "../../types/layoffSimulation";

interface SimulationSummaryCardProps {
	onSeeMore: () => void;
}

function clampScore(value: string): number {
	return Math.min(100, Math.max(0, Math.round(parseDecimal(value))));
}

export default function SimulationSummaryCard({
	onSeeMore,
}: SimulationSummaryCardProps) {
	const [result, setResult] = useState<LayoffSimulationResult | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;
		layoffSimulationApi
			.latest()
			.then((res) => {
				if (active) setResult(res);
			})
			.catch(() => {
				// belum ada simulasi — biarkan kosong
			})
			.finally(() => {
				if (active) setLoading(false);
			});
		return () => {
			active = false;
		};
	}, []);

	if (loading) {
		return (
			<div>
				<Skeleton className="h-3 w-2/3 mb-5" />
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
					{[0, 1, 2, 3].map((i) => (
						<Skeleton key={i} className="h-28 rounded-xl" />
					))}
				</div>
			</div>
		);
	}

	if (!result) {
		return (
			<div className="text-center py-6">
				<p className="text-sm font-semibold text-slate-900 mb-1">
					Belum ada data simulasi
				</p>
				<p className="text-xs text-slate-500 mb-4 max-w-xs mx-auto">
					Jalankan simulasi untuk melihat proyeksi ketahanan karier dan
					finansialmu.
				</p>
				<button
					type="button"
					onClick={onSeeMore}
					className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-800 cursor-pointer">
					Buka Simulasi
					<ArrowRight size={13} />
				</button>
			</div>
		);
	}

	const finScore = clampScore(result.financial_readiness_score);
	const carScore = clampScore(result.career_readiness_score);
	const skillScore = clampScore(result.skill_relevance_score);
	const mobScore = clampScore(result.job_mobility_score);

	const readiness = [
		{
			label: "Financial Readiness",
			value: finScore,
			icon: Wallet,
			variant: getScoreStatus(finScore),
		},
		{
			label: "Career Readiness",
			value: carScore,
			icon: HeartPulse,
			variant: getScoreStatus(carScore),
		},
		{
			label: "Skill Relevance",
			value: skillScore,
			icon: Zap,
			variant: "insight" as const,
		},
		{
			label: "Job Mobility",
			value: mobScore,
			icon: Compass,
			variant: "insight" as const,
		},
	];

	return (
		<div>
			<p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
				Hasil simulasi terakhir memproyeksikan ketahananmu menghadapi perubahan
				pekerjaan berdasarkan kondisi karier, skill, dan finansial.
			</p>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
				{readiness.map((item) => (
					<MetricCard
						key={item.label}
						label={item.label}
						value={`${item.value}/100`}
						icon={item.icon}
						variant={item.variant}
					/>
				))}
			</div>

			<button
				type="button"
				onClick={onSeeMore}
				className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-800 cursor-pointer">
				Lihat Simulasi Lengkap
				<ArrowRight size={13} />
			</button>
		</div>
	);
}
