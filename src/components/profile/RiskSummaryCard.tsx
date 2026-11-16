import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { getLevelStatus, normalizeRiskLevel, statusStyles } from "../../lib/status";
import StatusBadge from "../ui/StatusBadge";
import Skeleton from "../ui/Skeleton";
import { careerRiskApi } from "../../services/careerRisk";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";
import type { CareerRiskResult } from "../../types/careerRisk";

interface RiskSummaryCardProps {
	onSeeMore: () => void;
}

export default function RiskSummaryCard({ onSeeMore }: RiskSummaryCardProps) {
	const { refreshKey } = useCareerAssessment();
	const [result, setResult] = useState<CareerRiskResult | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;
		careerRiskApi
			.latest()
			.then((res) => {
				if (active) setResult(res);
			})
			.catch(() => {
				// belum ada penilaian — biarkan kosong
			})
			.finally(() => {
				if (active) setLoading(false);
			});
		return () => {
			active = false;
		};
	}, [refreshKey]);

	if (loading) {
		return (
			<div>
				<div className="flex items-center gap-3 mb-4">
					<Skeleton className="h-6 w-20 rounded-full" />
					<Skeleton className="h-3 flex-1" />
				</div>
				<Skeleton className="h-3 w-full mb-2" />
				<Skeleton className="h-3 w-2/3 mb-4" />
			</div>
		);
	}

	if (!result) {
		return (
			<div className="text-center py-6">
				<p className="text-sm text-slate-600 mb-3">
					Belum ada penilaian risiko karier.
				</p>
				<button
					type="button"
					onClick={onSeeMore}
					className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-800 cursor-pointer">
					Lihat Analisis Risiko
					<ArrowRight size={13} />
				</button>
			</div>
		);
	}

	const overallLevel = normalizeRiskLevel(result.level);
	const overallVariant = getLevelStatus(overallLevel);

	return (
		<div>
			<div className="flex items-start gap-3 mb-4">
				<StatusBadge label={overallLevel} variant={overallVariant} size="sm" />
				<p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
					{result.summary}
				</p>
			</div>

			<div className="divide-y divide-slate-100 border-t border-slate-100">
				{result.factors.slice(0, 4).map((item) => {
					const lvl = normalizeRiskLevel(item.level);
					const variant = getLevelStatus(lvl);
					const s = statusStyles[variant];
					return (
						<div
							key={item.key || item.title}
							className="flex items-center justify-between py-2.5 gap-3">
							<span className="text-xs sm:text-sm text-slate-700">
								{item.title}
							</span>
							<span className={`text-xs sm:text-sm font-semibold ${s.text}`}>
								{lvl}
							</span>
						</div>
					);
				})}
			</div>

			<button
				type="button"
				onClick={onSeeMore}
				className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-800 mt-4 cursor-pointer">
				Lihat Analisis Risiko
				<ArrowRight size={13} />
			</button>
		</div>
	);
}
