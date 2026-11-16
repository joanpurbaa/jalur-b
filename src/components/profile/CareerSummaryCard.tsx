import { useEffect, useState } from "react";
import { ShieldAlert, Cpu, HeartPulse } from "lucide-react";
import {
	getHealthStatus,
	getLevelStatus,
	localizeLevelLabel,
	normalizeRiskLevel,
} from "../../lib/status";
import { formatDateID } from "../../lib/format";
import StatusBadge from "../ui/StatusBadge";
import ScoreRing from "../ui/ScoreRing";
import StatCard from "../ui/StatCard";
import Skeleton from "../ui/Skeleton";
import { PrimaryButton } from "../ui/PrimaryButton";
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
				<Skeleton className="h-32 w-full rounded-xl" />
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<Skeleton className="h-32 rounded-xl" />
					<Skeleton className="h-32 rounded-xl" />
				</div>
			</div>
		);
	}

	if (!health && !risk && !exposure) {
		return (
			<div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
				<HeartPulse size={26} className="text-indigo-600 mx-auto mb-2" />
				<p className="text-sm font-semibold text-slate-900">
					Belum ada ringkasan penilaian karier
				</p>
				<p className="text-xs text-slate-500 mt-1 mb-4">
					Lengkapi penilaian karier untuk melihat skor kesehatan, risiko, dan
					relevansi skill di sini.
				</p>
				<PrimaryButton size="sm" onClick={openCareerAssessment}>
					Isi Penilaian Karier
				</PrimaryButton>
			</div>
		);
	}

	const score = health ? Math.round(parseDecimal(health.score)) : null;
	const status = health
		? getHealthStatus(health.status || health.level, score ?? undefined)
		: "neutral";
	const assessedDate = health ? formatDateID(health.assessed_at) : "";
	const riskLevel = risk ? normalizeRiskLevel(risk.level) : null;
	const relevance = exposure
		? Math.min(100, Math.round(parseDecimal(exposure.skill_relevance_score)))
		: null;

	return (
		<div className="space-y-4">
			<div className="rounded-xl bg-slate-50/80 border border-slate-200/80 p-5 flex flex-col sm:flex-row items-center gap-5">
				<ScoreRing
					value={score}
					max={100}
					size={88}
					stroke={9}
					status={status}
					suffix="/100"
					label="Skor Kesehatan Karier"
				/>
				<div className="text-center sm:text-left min-w-0 flex-1">
					<div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
						<span className="text-xs font-semibold text-slate-700">
							Kesehatan Karier
						</span>
						{health && (
							<StatusBadge
								label={localizeLevelLabel(health.status || health.level)}
								variant={status}
								size="sm"
							/>
						)}
						{assessedDate && (
							<span className="text-xs text-slate-500">
								Dinilai {assessedDate}
							</span>
						)}
					</div>
					{health?.summary && (
						<p className="text-sm text-slate-600 mt-1.5 line-clamp-2">
							{health.summary}
						</p>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<StatCard
					label="Risiko Karier"
					value={riskLevel ?? "—"}
					icon={ShieldAlert}
					tone="neutral"
					status={riskLevel ? getLevelStatus(riskLevel) : "neutral"}
					href="/dashboard/risiko-karier"
				/>
				<StatCard
					label="Relevansi Skill"
					value={relevance != null ? `${relevance}%` : "—"}
					icon={Cpu}
					tone="indigo"
					status="insight"
					progress={relevance}
					href="/dashboard/skill"
				/>
			</div>
		</div>
	);
}
