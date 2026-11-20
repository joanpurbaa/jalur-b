import { useEffect, useState } from "react";
import { Compass, GitFork, Lock, Scale, Sparkles } from "lucide-react";
import PageHeader from "../layouts/PageHeader";
import CareerPathMap from "./CareerPathMap";
import RoleDetailPanel from "./RoleDetailPanel";
import PrepTimeCard from "./PrepTimeCard";
import Card from "../ui/Card";
import IconTile from "../ui/IconTile";
import EmptyState from "../ui/EmptyState";
import ExpandableText from "../ui/ExpandableText";
import { PrimaryButton, SecondaryButton } from "../ui/PrimaryButton";
import { SkeletonHero, SkeletonStatCard } from "../ui/Skeleton";
import InfoTooltip from "../ui/InfoTooltip";
import ScoreRing from "../ui/ScoreRing";
import SkillPill from "../ui/SkillPill";
import LockedPreviewCard from "../ui/LockedPreviewCard";
import { CreditCostPill } from "../ui/CreditLockBanner";
import { careerPivotApi } from "../../services/careerPivot";
import { loadManualCache, saveManualCache } from "../../lib/manualCache";
import { parseDecimal } from "../../lib/parseNumeric";
import { normalizeConfidence } from "../../lib/status";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";
import { useCredits } from "../../context/CreditsContext";
import type { CareerPivotResult } from "../../types/careerPivot";

export default function JalurKarier() {
	const { refreshKey, openCareerAssessment } = useCareerAssessment();
	const { isUnlocked, requestUnlock } = useCredits();

	const cachedPivot = loadManualCache<CareerPivotResult>("career_pivot");
	const [result, setResult] = useState<CareerPivotResult | null>(
		() => cachedPivot?.data ?? null,
	);
	const [loading, setLoading] = useState(() => !cachedPivot?.data);
	const [selectedIdx, setSelectedIdx] = useState(0);
	const [showCompare, setShowCompare] = useState(false);

	useEffect(() => {
		let active = true;
		careerPivotApi
			.latest()
			.then((res) => {
				if (active) {
					setResult(res);
					saveManualCache("career_pivot", res);
					setSelectedIdx(0);
				}
			})
			.catch(() => {
				// belum ada penilaian — pertahankan cache jika ada atau biarkan kosong
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
	const skillGapUnlocked = isUnlocked("skill_gap_map");
	const compareUnlocked = isUnlocked("compare_roles");
	const isActiveRoleLocked = selectedIdx > 0 && !skillGapUnlocked;

	const handleToggleCompare = () => {
		if (compareUnlocked) {
			setShowCompare((v) => !v);
			return;
		}
		requestUnlock("compare_roles", () => setShowCompare(true));
	};

	return (
		<div>
			<PageHeader
				title="Jalur Karier"
				subtitle="Jika suatu saat kamu ingin berpindah peran, ini peta alternatif yang paling dekat dengan modal skill-mu."
				action={
					result && result.roles.length > 1 ? (
						<SecondaryButton
							size="sm"
							icon={
								compareUnlocked ? <Scale size={14} /> : <Lock size={13} />
							}
							onClick={handleToggleCompare}>
							<span>
								{showCompare && compareUnlocked
									? "Tutup Perbandingan"
									: "Bandingkan Peran"}
							</span>
							{!compareUnlocked && <CreditCostPill cost={3} />}
						</SecondaryButton>
					) : undefined
				}
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
				<div className="space-y-6">
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
								lockSecondaryRoles={!skillGapUnlocked}
								onSelectRole={setSelectedIdx}
							/>
						</div>
						<div className="lg:col-span-5 xl:col-span-4">
							{isActiveRoleLocked ? (
								<LockedPreviewCard
									featureId="skill_gap_map"
									title={activeRole.role_name}
									subtitle={`Peran Alternatif #${selectedIdx + 1} · Peta skill gap & estimasi persiapan`}
									icon={Compass}
									previewMaxHeight="max-h-[214px]"
									lockedHint="Contoh pratinjau · Beli credit untuk peta skill gap aslimu"
									lockedPreview={
										<div className="space-y-4">
											<div className="flex items-center gap-4 py-3 px-4 rounded-xl bg-slate-50 border border-slate-200/80">
												<ScoreRing
													value={78}
													max={100}
													size={76}
													stroke={7}
													status="insight"
													suffix="%"
													label="Contoh kecocokan peran"
												/>
												<div>
													<p className="text-xs font-semibold text-slate-500">
														Kecocokan Profil
													</p>
													<p className="text-xs text-slate-600 mt-1 leading-relaxed">
														Estimasi persiapan ~3 bulan dengan 4 skill jembatan
														prioritas.
													</p>
												</div>
											</div>

											<div className="flex flex-wrap gap-2">
												{[
													"Data Storytelling",
													"Product Roadmap",
													"SQL Dasar",
													"Stakeholder Alignment",
												].map((skill) => (
													<SkillPill
														key={`dummy-gap-${skill}`}
														label={skill}
														tone="neutral"
													/>
												))}
											</div>
										</div>
									}>
									<div className="space-y-4">
										<div className="flex items-center gap-4 py-3 px-4 rounded-xl bg-slate-50 border border-slate-200/80">
											<ScoreRing
												value={Math.round(parseDecimal(activeRole.match_score))}
												max={100}
												size={76}
												stroke={7}
												status="insight"
												suffix="%"
												label={`Kecocokan ${activeRole.role_name}`}
											/>
											<div>
												<p className="text-xs font-semibold text-slate-500">
													Kecocokan Profil
												</p>
												<p className="text-xs text-slate-600 mt-1 leading-relaxed">
													Estimasi persiapan ~{activeRole.preparation_time_months}{" "}
													bulan dengan {activeRole.missing_skills.length} skill
													jembatan.
												</p>
											</div>
										</div>

										<div className="flex flex-wrap gap-2 opacity-60">
											{activeRole.missing_skills.slice(0, 6).map((skill) => (
												<SkillPill key={skill} label={skill} tone="neutral" />
											))}
										</div>
									</div>
								</LockedPreviewCard>
							) : (
								<>
									<RoleDetailPanel
										roleName={activeRole.role_name}
										matchScore={Math.round(parseDecimal(activeRole.match_score))}
										missingSkills={activeRole.missing_skills}
									/>
									<PrepTimeCard
										months={activeRole.preparation_time_months}
										description={activeRole.preparation_description}
									/>
								</>
							)}
						</div>
					</div>

					{/* Matriks Perbandingan Peran (terbuka via 3 credit) */}
					{showCompare && compareUnlocked && result.roles.length > 1 && (
						<Card padding="lg">
							<div className="flex items-center justify-between gap-3 mb-4">
								<div className="flex items-center gap-2.5">
									<IconTile icon={Scale} tone="indigo" size="sm" />
									<div>
										<div className="flex items-center gap-2">
											<h3 className="text-base font-bold text-slate-900">
												Perbandingan Semua Peran Alternatif
											</h3>
											<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
												<Sparkles size={10} />
												Terbuka
											</span>
										</div>
										<p className="text-xs text-slate-500 mt-0.5">
											Bandingkan kecocokan, waktu persiapan, dan jumlah skill jembatan
										</p>
									</div>
								</div>
							</div>

							<div className="overflow-x-auto -mx-2 px-2">
								<table className="w-full text-left border-collapse text-xs sm:text-sm">
									<thead>
										<tr className="border-b border-slate-200 text-slate-500 text-xs">
											<th className="py-2.5 pr-3 font-semibold">Peran</th>
											<th className="py-2.5 px-3 font-semibold">Kecocokan</th>
											<th className="py-2.5 px-3 font-semibold">Persiapan</th>
											<th className="py-2.5 pl-3 font-semibold">Skill Jembatan</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-slate-100">
										{result.roles.map((r, idx) => (
											<tr
												key={r.role_name}
												onClick={() => setSelectedIdx(idx)}
												className="hover:bg-slate-50/80 cursor-pointer transition">
												<td className="py-3 pr-3 font-semibold text-slate-900">
													<div className="flex items-center gap-2">
														<span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-bold shrink-0">
															{idx + 1}
														</span>
														<span>{r.role_name}</span>
													</div>
												</td>
												<td className="py-3 px-3 font-bold text-indigo-700 tabular">
													{Math.round(parseDecimal(r.match_score))}%
												</td>
												<td className="py-3 px-3 text-slate-700 tabular">
													~{r.preparation_time_months} bln
												</td>
												<td className="py-3 pl-3 text-slate-600">
													{r.missing_skills.length > 0
														? `${r.missing_skills.length} skill (${r.missing_skills.slice(0, 2).join(", ")}${r.missing_skills.length > 2 ? "…" : ""})`
														: "Tidak ada gap mayor"}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</Card>
					)}
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
