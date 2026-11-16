import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, HeartPulse, RefreshCw, Sparkles } from "lucide-react";
import { SkeletonHero } from "../ui/Skeleton";
import StatusBadge from "../ui/StatusBadge";
import ScoreRing from "../ui/ScoreRing";
import { careerHealthApi } from "../../services/careerHealth";
import { parseDecimal } from "../../lib/parseNumeric";
import { getScoreStatus } from "../../lib/status";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";
import type { HealthAssessmentResult } from "../../types/careerHealth";

export default function CareerHealthCard() {
	const { refreshKey, openCareerAssessment } = useCareerAssessment();

	const [result, setResult] = useState<HealthAssessmentResult | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;
		careerHealthApi
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
		return <SkeletonHero className="mb-7" />;
	}

	const score = result ? Math.round(parseDecimal(result.score)) : null;
	const statusVariant = score != null ? getScoreStatus(score) : "neutral";

	return (
		<section
			aria-label="Ringkasan Kesehatan Karier"
			className="relative overflow-hidden rounded-3xl p-6 sm:p-8 mb-7 text-white shadow-[0_24px_48px_-18px_rgba(79,70,229,0.45)] bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 border border-white/20">
			{/* Dekorasi cahaya latar */}
			<div
				aria-hidden
				className="pointer-events-none absolute -top-24 -right-16 w-80 h-80 rounded-full bg-fuchsia-400/25 blur-3xl"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl"
			/>

			<div className="relative flex flex-col md:flex-row items-center gap-6 sm:gap-8">
				<ScoreRing
					value={score}
					max={100}
					size={156}
					stroke={14}
					onDark
					colors={
						statusVariant === "healthy"
							? ["#34d399", "#a7f3d0"]
							: statusVariant === "warning"
								? ["#fbbf24", "#fde68a"]
								: statusVariant === "risk"
									? ["#fb7185", "#fecdd3"]
									: ["#a5b4fc", "#e0e7ff"]
					}
					suffix="/100"
					label="Skor Kesehatan Karier"
				/>

				<div className="flex-1 min-w-0 text-center md:text-left">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-bold tracking-wide uppercase mb-3">
						<HeartPulse size={14} />
						<span>Command Center · Career Health</span>
					</div>

					{result ? (
						<>
							<div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
								<h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
									Fondasi kariermu{" "}
									<span className="accent-serif font-normal text-indigo-100">
										{score != null && score >= 75
											? "kuat dan terjaga"
											: score != null && score >= 60
												? "cukup stabil, siap diperkuat"
												: "punya ruang bertumbuh yang jelas"}
									</span>
								</h2>
								<StatusBadge
									label={result.status}
									variant={statusVariant}
									onDark
								/>
							</div>
							<p className="text-sm sm:text-[15px] text-indigo-100/90 mt-2.5 leading-relaxed line-clamp-2 max-w-2xl">
								{result.summary}
							</p>
						</>
					) : (
						<>
							<h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
								Yuk, ukur titik awal ketahanan kariermu
							</h2>
							<p className="text-sm sm:text-[15px] text-indigo-100/90 mt-2 leading-relaxed max-w-xl">
								Belum ada penilaian karier. Luangkan 2 menit untuk memetakan
								kekuatan peran, pencapaian, dan kesiapanmu menghadapi perubahan.
							</p>
						</>
					)}

					<div className="mt-5 flex flex-wrap items-center justify-center md:justify-start gap-3">
						{result ? (
							<>
								<Link
									to="/dashboard/kesehatan-karier"
									className="press inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-700 text-sm font-bold shadow-md hover:bg-indigo-50">
									Lihat Detail Kesehatan
									<ArrowRight size={16} />
								</Link>
								<button
									type="button"
									onClick={openCareerAssessment}
									className="press inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold border border-white/25 cursor-pointer">
									<RefreshCw size={14} />
									Perbarui Penilaian
								</button>
							</>
						) : (
							<button
								type="button"
								onClick={openCareerAssessment}
								className="press inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-indigo-700 text-sm font-bold shadow-md hover:bg-indigo-50 cursor-pointer">
								<Sparkles size={16} />
								Mulai Penilaian Karier
							</button>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
