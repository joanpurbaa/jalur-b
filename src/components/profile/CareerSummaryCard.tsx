import { useEffect, useState } from "react";
import { ShieldAlert, Sparkles, HeartPulse } from "lucide-react";
import {
	getScoreStatus,
	getLevelStatus,
	normalizeRiskLevel,
} from "../../lib/status";
import { formatDateID } from "../../lib/format";
import StatusBadge from "../ui/StatusBadge";
import ScoreRing from "../ui/ScoreRing";
import StatCard from "../ui/StatCard";
import Skeleton from "../ui/Skeleton";
import { careerHealthApi } from "../../services/careerHealth";
import { careerRiskApi } from "../../services/careerRisk";
import { aiExposureApi } from "../../services/aiExposure";
import { parseDecimal } from "../../lib/parseNumeric";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";
import type { HealthAssessmentResult } from "../../types/careerHealth";
import type { CareerRiskResult } from "../../types/careerRisk";
import type { AiExposureResult } from "../../types/aiExposure";

export default function CareerSummaryCard() {
	const { refreshKey, openCareerAssessment } = useCareerAssessment();

	const [health, setHealth] = useState<HealthAssessmentResult | null>(null);
	const [risk, setRisk] = useState<CareerRiskResult | null>(null);
	const [exposure, setExposure] = useState<AiExposureResult | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;
		const load = async () => {
			const [h, r, e] = await Promise.allSettled([
				careerHealthApi.latest(),
				careerRiskApi.latest(),
				aiExposureApi.latest(),
			]);
			if (!active) return;
			if (h.status === "fulfilled") setHealth(h.value);
			if (r.status === "fulfilled") setRisk(r.value);
			if (e.status === "fulfilled") setExposure(e.value);
			setLoading(false);
		};
		void load();
		return () => {
			active = false;
		};
	}, [refreshKey]);

	if (loading) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-32 w-full rounded-2xl" />
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<Skeleton className="h-32 rounded-2xl" />
					<Skeleton className="h-32 rounded-2xl" />
				</div>
			</div>
		);
	}

	if (!health && !risk && !exposure) {
		return (
			<div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
				<HeartPulse size={28} className="text-rose-500 mx-auto mb-2" />
				<p className="text-sm font-bold text-neutral">
					Belum ada ringkasan penilaian karier
				</p>
				<p className="text-xs text-neutral/60 mt-1 mb-4">
					Lengkapi penilaian karier singkat untuk melihat skor kesehatan, risiko,
					dan relevansi skill-mu di sini.
				</p>
				<button
					type="button"
					onClick={openCareerAssessment}
					className="press px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer">
					Isi Penilaian Karier
				</button>
			</div>
		);
	}

	const score = health ? Math.round(parseDecimal(health.score)) : null;
	const status = score != null ? getScoreStatus(score) : "neutral";
	const assessedDate = health ? formatDateID(health.assessed_at) : "";
	const riskLevel = risk ? normalizeRiskLevel(risk.level) : null;
	const relevance = exposure
		? Math.min(100, Math.round(parseDecimal(exposure.skill_relevance_score)))
		: null;

	return (
		<div className="space-y-4">
			<div className="rounded-2xl bg-gradient-to-r from-rose-50/80 via-white to-indigo-50/70 border border-rose-100 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<ScoreRing
						value={score}
						max={100}
						size={92}
						stroke={9}
						status={status}
						suffix="/100"
						label="Career Health Score"
					/>
					<div>
						<span className="text-xs font-extrabold uppercase tracking-wider text-rose-700">
							Career Health Score
						</span>
						<div className="flex flex-wrap items-center gap-2 mt-1">
							{health && (
								<StatusBadge
									label={health.status ?? (health.level || "Dipantau")}
									variant={status}
									size="sm"
								/>
							)}
							{assessedDate && (
								<span className="text-xs text-neutral/50 font-medium">
									Dinilai {assessedDate}
								</span>
							)}
						</div>
						{health?.summary && (
							<p className="text-xs text-neutral/70 mt-1.5 line-clamp-2 max-w-md">
								{health.summary}
							</p>
						)}
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<StatCard
					label="Risiko Karier"
					value={riskLevel ?? "—"}
					icon={ShieldAlert}
					tone="risiko-karier"
					status={riskLevel ? getLevelStatus(riskLevel) : "neutral"}
					href="/dashboard/risiko-karier"
				/>
				<StatCard
					label="Skill Relevance"
					value={relevance != null ? `${relevance}%` : "—"}
					icon={Sparkles}
					tone="skill"
					status={relevance != null ? getScoreStatus(relevance) : "neutral"}
					progress={relevance}
					href="/dashboard/skill"
				/>
			</div>
		</div>
	);
}
