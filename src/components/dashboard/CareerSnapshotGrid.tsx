import { useEffect, useState } from "react";
import { GitFork, ShieldAlert, Sparkles, Wallet } from "lucide-react";
import StatCard from "../ui/StatCard";
import { SkeletonStatCard } from "../ui/Skeleton";
import { Stagger, StaggerItem, CountUp } from "../ui/Motion";
import { dashboardApi } from "../../services/dashboard";
import { careerRiskApi } from "../../services/careerRisk";
import { careerPivotApi } from "../../services/careerPivot";
import { aiExposureApi } from "../../services/aiExposure";
import { financialApi, parseRunwayMonths } from "../../services/financial";
import { parseDecimal } from "../../lib/parseNumeric";
import { formatMonths } from "../../lib/format";
import {
	getLevelStatus,
	getRunwayStatus,
	getScoreStatus,
	normalizeRiskLevel,
	type RiskLevel,
	type StatusVariant,
} from "../../lib/status";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";

interface SnapshotData {
	riskLevel: RiskLevel | null;
	skillProgress: number | null;
	runwayMonths: number | null;
	targetRunwayMonths: number;
	pivotMatch: number | null;
	topPivotTitle: string | null;
}

export default function CareerSnapshotGrid() {
	const { refreshKey } = useCareerAssessment();

	const [data, setData] = useState<SnapshotData>({
		riskLevel: null,
		skillProgress: null,
		runwayMonths: null,
		targetRunwayMonths: 6,
		pivotMatch: null,
		topPivotTitle: null,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;
		const load = async () => {
			const [dashResult, riskResult, pivotResult, exposureResult, finResult] =
				await Promise.allSettled([
					dashboardApi.get(),
					careerRiskApi.latest(),
					careerPivotApi.latest(),
					aiExposureApi.latest(),
					financialApi.get(),
				]);
			if (!active) return;

			const next: SnapshotData = {
				riskLevel: null,
				skillProgress: null,
				runwayMonths: null,
				targetRunwayMonths: 6,
				pivotMatch: null,
				topPivotTitle: null,
			};

			if (riskResult.status === "fulfilled") {
				next.riskLevel = normalizeRiskLevel(riskResult.value.level);
			}

			if (
				pivotResult.status === "fulfilled" &&
				pivotResult.value.roles.length > 0
			) {
				next.pivotMatch = Math.round(
					parseDecimal(pivotResult.value.roles[0].match_score),
				);
				next.topPivotTitle = pivotResult.value.roles[0].role_name;
			}

			if (exposureResult.status === "fulfilled") {
				next.skillProgress = Math.max(
					0,
					Math.min(
						100,
						Math.round(
							parseDecimal(exposureResult.value.skill_relevance_score),
						),
					),
				);
			}

			// Utamakan sumber finansial langsung bila ada, fallback ke ringkasan dashboard
			if (finResult.status === "fulfilled" && finResult.value.runway) {
				const parsed = parseRunwayMonths(finResult.value.runway);
				next.runwayMonths = parsed.current;
				if (parsed.target > 0) next.targetRunwayMonths = parsed.target;
			} else if (
				dashResult.status === "fulfilled" &&
				dashResult.value.financial
			) {
				next.runwayMonths = parseDecimal(
					dashResult.value.financial.runway_months,
				);
			}

			setData(next);
			setLoading(false);
		};
		void load();
		return () => {
			active = false;
		};
	}, [refreshKey]);

	if (loading) {
		return (
			<section className="mb-8" aria-label="Career Snapshot">
				<div className="flex items-center justify-between mb-3.5">
					<h2 className="text-base font-extrabold text-neutral">
						Ringkasan 4 Pilar
					</h2>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
					{[0, 1, 2, 3].map((i) => (
						<SkeletonStatCard key={i} />
					))}
				</div>
			</section>
		);
	}

	const riskStatus: StatusVariant = data.riskLevel
		? getLevelStatus(data.riskLevel)
		: "neutral";
	const riskSeg: 1 | 2 | 3 =
		data.riskLevel === "Rendah" ? 1 : data.riskLevel === "Sedang" ? 2 : 3;

	const skillStatus: StatusVariant =
		data.skillProgress != null ? getScoreStatus(data.skillProgress) : "neutral";

	const pivotStatus: StatusVariant =
		data.pivotMatch == null
			? "neutral"
			: data.pivotMatch >= 70
				? "healthy"
				: data.pivotMatch >= 45
					? "warning"
					: "risk";

	const runwayStatus: StatusVariant =
		data.runwayMonths == null
			? "neutral"
			: getRunwayStatus(data.runwayMonths, data.targetRunwayMonths);

	const runwayProgress =
		data.runwayMonths != null
			? Math.min(
					100,
					Math.round(
						(data.runwayMonths / Math.max(1, data.targetRunwayMonths)) * 100,
					),
				)
			: null;

	return (
		<section className="mb-8" aria-label="Ringkasan 4 Pilar Karier">
			<div className="flex items-center justify-between mb-3.5">
				<div>
					<h2 className="text-base sm:text-lg font-extrabold text-neutral">
						Peta Kondisi Saat Ini
					</h2>
					<p className="text-xs sm:text-sm text-neutral/60">
						Ketuk kartu untuk mendalami tiap modul
					</p>
				</div>
			</div>

			<Stagger className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
				<StaggerItem>
					<StatCard
						label="Risiko Karier"
						value={data.riskLevel ?? "—"}
						subtitle={
							data.riskLevel === "Rendah"
								? "Posisi relatif terjaga"
								: data.riskLevel === "Sedang"
									? "Ada sinyal yang perlu dipantau"
									: data.riskLevel === "Tinggi"
										? "Siapkan langkah antisipasi"
										: "Lengkapi penilaian karier"
						}
						icon={ShieldAlert}
						tone="risiko-karier"
						status={riskStatus}
						statusLabel={data.riskLevel ?? "Belum dinilai"}
						segments={
							data.riskLevel
								? { active: riskSeg, status: riskStatus }
								: null
						}
						href="/dashboard/risiko-karier"
					/>
				</StaggerItem>

				<StaggerItem>
					<StatCard
						label="Relevansi Skill"
						value={
							data.skillProgress != null ? (
								<>
									<CountUp value={data.skillProgress} />%
								</>
							) : (
								"—"
							)
						}
						subtitle="Daya tahan skill di era AI"
						icon={Sparkles}
						tone="skill"
						status={skillStatus}
						progress={data.skillProgress}
						href="/dashboard/skill"
					/>
				</StaggerItem>

				<StaggerItem>
					<StatCard
						label="Kecocokan Pivot"
						value={
							data.pivotMatch != null ? (
								<>
									<CountUp value={data.pivotMatch} />%
								</>
							) : (
								"—"
							)
						}
						subtitle={
							data.topPivotTitle
								? `Opsi terdekat: ${data.topPivotTitle}`
								: "Alternatif jalur karier"
						}
						icon={GitFork}
						tone="jalur-karier"
						status={pivotStatus}
						progress={data.pivotMatch}
						href="/dashboard/jalur-karier"
					/>
				</StaggerItem>

				<StaggerItem>
					<StatCard
						label="Runway Finansial"
						value={
							data.runwayMonths != null
								? formatMonths(data.runwayMonths)
								: "—"
						}
						subtitle={
							data.runwayMonths != null
								? `Target aman ${formatMonths(data.targetRunwayMonths)}`
								: "Atur parameter finansial"
						}
						icon={Wallet}
						tone="finansial"
						status={runwayStatus}
						statusLabel={
							data.runwayMonths == null
								? "Belum diisi"
								: runwayStatus === "healthy"
									? "Di atas target"
									: runwayStatus === "warning"
										? "Mendekati target"
										: "Area ditingkatkan"
						}
						progress={runwayProgress}
						href="/dashboard/finansial"
					/>
				</StaggerItem>
			</Stagger>
		</section>
	);
}
