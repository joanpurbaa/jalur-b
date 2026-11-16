import { useEffect, useState } from "react";
import { GitFork, Sparkles, Upload } from "lucide-react";
import PageHeader from "../layouts/PageHeader";
import CareerPathMap from "./CareerPathMap";
import RoleDetailPanel from "./RoleDetailPanel";
import PrepTimeCard from "./PrepTimeCard";
import Card from "../ui/Card";
import IconTile from "../ui/IconTile";
import EmptyState from "../ui/EmptyState";
import { PrimaryButton } from "../ui/PrimaryButton";
import { SkeletonHero, SkeletonStatCard } from "../ui/Skeleton";
import InfoTooltip from "../ui/InfoTooltip";
import { careerPivotApi } from "../../services/careerPivot";
import { parseDecimal } from "../../lib/parseNumeric";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";
import type { CareerPivotResult } from "../../types/careerPivot";

function clampPercent(value: number): number {
	return Math.min(100, Math.max(0, Math.round(value)));
}

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

	const confidence = result
		? clampPercent(parseDecimal(result.data_confidence) * 100)
		: 0;
	const activeRole =
		result && result.roles.length > 0
			? result.roles[Math.min(selectedIdx, result.roles.length - 1)]
			: null;

	return (
		<div>
			<PageHeader
				title="Jalur Karier"
				subtitle="Kalau suatu hari kamu ingin atau harus berpindah haluan, ini peta peran terdekat yang paling cocok dengan modal keahlianmu."
				action={
					<PrimaryButton
						tone="jalur-karier"
						icon={<Upload size={15} />}
						onClick={openCareerAssessment}>
						{result ? "Perbarui Data Karier" : "Lengkapi Data Karier"}
					</PrimaryButton>
				}
			/>

			{result && (
				<Card
					padding="md"
					className="mb-6 bg-gradient-to-r from-emerald-50/80 via-white to-teal-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div className="flex items-start gap-3.5">
						<IconTile icon={Sparkles} tone="jalur-karier" size="sm" />
						<div>
							<p className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 mb-0.5">
								Rekomendasi Kompas Karier
							</p>
							<p className="text-sm sm:text-[15px] text-neutral/80 leading-relaxed">
								{result.summary}
							</p>
						</div>
					</div>
					{confidence > 0 && (
						<span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-bold">
							Kelengkapan {confidence}%
							<InfoTooltip text="Seberapa lengkap data yang kamu isi. Bukan ukuran ketepatan prediksi." />
						</span>
					)}
				</Card>
			)}

			{loading ? (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
					<div className="lg:col-span-2">
						<SkeletonHero className="h-[480px]" />
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
					tone="jalur-karier"
					title="Belum ada rekomendasi jalur karier"
					description="Lengkapi data karier supaya Jalur B bisa memetakan peran alternatif dengan kecocokan tertinggi beserta estimasi waktu persiapannya."
					action={
						<PrimaryButton
							tone="jalur-karier"
							icon={<Sparkles size={15} />}
							onClick={openCareerAssessment}>
							Petakan Jalur Karier
						</PrimaryButton>
					}
				/>
			)}
		</div>
	);
}
