import { useEffect, useState } from "react";
import { Compass, GitFork } from "lucide-react";
import PageHeader from "../layouts/PageHeader";
import CareerPathMap from "./CareerPathMap";
import RoleDetailPanel from "./RoleDetailPanel";
import PrepTimeCard from "./PrepTimeCard";
import Card from "../ui/Card";
import IconTile from "../ui/IconTile";
import EmptyState from "../ui/EmptyState";
import ExpandableText from "../ui/ExpandableText";
import { PrimaryButton } from "../ui/PrimaryButton";
import { SkeletonHero, SkeletonStatCard } from "../ui/Skeleton";
import InfoTooltip from "../ui/InfoTooltip";
import { careerPivotApi } from "../../services/careerPivot";
import { parseDecimal } from "../../lib/parseNumeric";
import { normalizeConfidence } from "../../lib/status";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";
import type { CareerPivotResult } from "../../types/careerPivot";

export default function JalurKarier() {
	const { refreshKey, openCareerAssessment } = useCareerAssessment();

	const [result, setResult] = useState<CareerPivotResult | null>(null);
	const [loading, setLoading] = useState(true);
	const [selectedIdx, setSelectedIdx] = useState(0);

	useEffect(() => {
		let active = true;
		careerPivotApi
			.latest()
			.then((res) => {
				if (active) {
					setResult(res);
					setSelectedIdx(0);
				}
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

	const confidence = result ? normalizeConfidence(result.data_confidence) : 0;
	const activeRole =
		result && result.roles.length > 0
			? result.roles[Math.min(selectedIdx, result.roles.length - 1)]
			: null;

	return (
		<div>
			<PageHeader
				title="Jalur Karier"
				subtitle="Jika suatu saat kamu ingin berpindah peran, ini peta alternatif yang paling dekat dengan modal skill-mu."
			/>

			{result && (
				<Card
					variant="hero"
					padding="md"
					className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div className="flex items-start gap-3.5 min-w-0">
						<IconTile icon={Compass} tone="indigo" size="sm" />
						<div className="min-w-0">
							<p className="text-xs font-semibold text-indigo-700 mb-0.5">
								Ringkasan Rekomendasi AI
							</p>
							<ExpandableText
								text={result.summary}
								maxLines={3}
								className="text-sm text-slate-700 leading-relaxed"
							/>
						</div>
					</div>
					{confidence > 0 && (
						<span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold">
							Cakupan data {confidence}%
							<InfoTooltip text="Tingkat kelengkapan informasi analisis ini, bukan jaminan ketepatan prediksi." />
						</span>
					)}
				</Card>
			)}

			{loading ? (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
					<div className="lg:col-span-2">
						<SkeletonHero className="h-[460px]" />
					</div>
					<div className="space-y-4">
						<SkeletonStatCard />
						<SkeletonStatCard />
					</div>
				</div>
			) : result && activeRole ? (
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
					<div className="lg:col-span-7 xl:col-span-8">
						<CareerPathMap
							currentRoleName={result.current_role_name}
							roles={result.roles.map((r) => ({
								name: r.role_name,
								match: Math.round(parseDecimal(r.match_score)),
								prepMonths: r.preparation_time_months,
							}))}
							selectedIndex={selectedIdx}
							onSelectRole={setSelectedIdx}
						/>
					</div>
					<div className="lg:col-span-5 xl:col-span-4">
						<RoleDetailPanel
							roleName={activeRole.role_name}
							matchScore={Math.round(parseDecimal(activeRole.match_score))}
							missingSkills={activeRole.missing_skills}
						/>
						<PrepTimeCard
							months={activeRole.preparation_time_months}
							description={activeRole.preparation_description}
						/>
					</div>
				</div>
			) : (
				<EmptyState
					illustration="compass"
					icon={GitFork}
					tone="indigo"
					title="Belum ada rekomendasi jalur karier"
					description="Lengkapi data karier supaya Jalur B bisa memetakan peran alternatif dengan kecocokan tertinggi beserta estimasi waktu persiapannya."
					action={
						<PrimaryButton onClick={openCareerAssessment}>
							Petakan Jalur Karier
						</PrimaryButton>
					}
				/>
			)}
		</div>
	);
}
