import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, Sparkles } from "lucide-react";
import Skeleton from "../ui/Skeleton";
import Card from "../ui/Card";
import IconTile from "../ui/IconTile";
import Modal from "../ui/Modal";
import StatusBadge from "../ui/StatusBadge";
import MeterBar from "../ui/MeterBar";
import { SecondaryButton } from "../ui/PrimaryButton";
import { careerRiskApi } from "../../services/careerRisk";
import { parseDecimal } from "../../lib/parseNumeric";
import {
	getLevelStatus,
	normalizeRiskLevel,
} from "../../lib/status";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";
import type { CareerRiskResult } from "../../types/careerRisk";

export default function InsightCard() {
	const { refreshKey, openCareerAssessment } = useCareerAssessment();

	const [result, setResult] = useState<CareerRiskResult | null>(null);
	const [loading, setLoading] = useState(true);
	const [drawerOpen, setDrawerOpen] = useState(false);

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

	const riskLevel = result ? normalizeRiskLevel(result.level) : null;
	const statusVariant = riskLevel ? getLevelStatus(riskLevel) : "insight";

	return (
		<>
			<Card padding="lg" className="flex flex-col justify-between h-full">
				<div>
					<div className="flex items-center justify-between gap-3 mb-4">
						<div className="flex items-center gap-3">
							<span className="motion-safe:animate-spark inline-flex">
								<IconTile icon={Sparkles} tone="skill" size="sm" />
							</span>
							<div>
								<h3 className="text-base font-extrabold text-neutral">
									AI Career Insight
								</h3>
								<p className="text-xs text-neutral/55">
									Ringkasan sinyal pasar & posisi peranmu
								</p>
							</div>
						</div>
						{riskLevel && (
							<StatusBadge
								variant={statusVariant}
								label={`Risiko ${riskLevel}`}
								size="sm"
							/>
						)}
					</div>

					{loading ? (
						<div className="space-y-2.5 my-2">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-11/12" />
							<Skeleton className="h-4 w-3/4" />
						</div>
					) : result && (result.summary || result.analysis) ? (
						<div className="space-y-2.5">
							<p className="text-sm sm:text-[15px] text-neutral/85 leading-relaxed line-clamp-3">
								{result.summary || result.analysis}
							</p>
							{result.early_warning && (
								<div className="flex items-start gap-2 rounded-xl bg-amber-50/90 border border-amber-200/80 px-3 py-2 text-xs text-amber-900">
									<AlertTriangle
										size={14}
										className="text-amber-600 shrink-0 mt-0.5"
									/>
									<span className="line-clamp-2">{result.early_warning}</span>
								</div>
							)}
						</div>
					) : (
						<p className="text-sm text-neutral/70 leading-relaxed">
							Belum ada insight AI. Setelah kamu melengkapi penilaian karier,
							bagian ini akan merangkum sinyal risiko industri dan peluang
							penguatanmu secara tenang dan objektif.
						</p>
					)}
				</div>

				<div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
					{result ? (
						<SecondaryButton size="sm" onClick={() => setDrawerOpen(true)}>
							Pelajari kenapa →
						</SecondaryButton>
					) : (
						<SecondaryButton size="sm" onClick={openCareerAssessment}>
							Isi Penilaian Karier →
						</SecondaryButton>
					)}
					<Link
						to="/dashboard/risiko-karier"
						className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1">
						Buka Risiko Karier
						<ArrowRight size={13} />
					</Link>
				</div>
			</Card>

			<Modal
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				variant="drawer"
				title="Mengapa AI Menyimpulkan Ini?"
				subtitle="Penjelasan faktor risiko dan sinyal awal pada peranmu">
				{result && (
					<div className="space-y-6">
						<div className="rounded-2xl bg-indigo-50/70 border border-indigo-100 p-4">
							<div className="flex items-center justify-between gap-2 mb-2">
								<span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
									Ringkasan Analisis
								</span>
								{riskLevel && (
									<StatusBadge
										variant={statusVariant}
										label={`Risiko ${riskLevel}`}
										size="sm"
									/>
								)}
							</div>
							<p className="text-sm text-neutral/85 leading-relaxed">
								{result.analysis || result.summary}
							</p>
						</div>

						{result.early_warning && (
							<div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
								<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-1.5">
									<AlertTriangle size={14} />
									<span>Sinyal Awal yang Perlu Diwaspadai</span>
								</div>
								<p className="text-sm text-amber-950/85 leading-relaxed">
									{result.early_warning}
								</p>
							</div>
						)}

						{result.factors.length > 0 && (
							<div>
								<h4 className="text-sm font-extrabold text-neutral mb-3">
									Rincian Dimensi Risiko
								</h4>
								<div className="space-y-3">
									{result.factors.map((f) => {
										const fScore = Math.round(parseDecimal(f.score));
										const fLevel = normalizeRiskLevel(f.level);
										const fStatus = getLevelStatus(fLevel);
										return (
											<div
												key={f.key}
												className="rounded-2xl border border-slate-200/80 p-3.5 bg-slate-50/50">
												<div className="flex items-center justify-between gap-2 mb-2">
													<span className="text-sm font-bold text-neutral">
														{f.title}
													</span>
													<StatusBadge
														variant={fStatus}
														label={`${fLevel} (${fScore})`}
														size="sm"
													/>
												</div>
												<MeterBar
													value={fScore}
													max={100}
													status={fStatus}
													height="sm"
												/>
												<p className="text-xs text-neutral/70 mt-2 leading-relaxed">
													{f.explanation}
												</p>
											</div>
										);
									})}
								</div>
							</div>
						)}

						<Link
							to="/dashboard/risiko-karier"
							onClick={() => setDrawerOpen(false)}
							className="press w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-indigo-600 text-white text-sm font-bold shadow-md">
							Lihat Halaman Risiko Karier Lengkap
							<ArrowRight size={16} />
						</Link>
					</div>
				)}
			</Modal>
		</>
	);
}
