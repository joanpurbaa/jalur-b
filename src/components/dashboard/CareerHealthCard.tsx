import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, HeartPulse } from "lucide-react";
import Card from "../ui/Card";
import { SkeletonHero } from "../ui/Skeleton";
import StatusBadge from "../ui/StatusBadge";
import ScoreRing from "../ui/ScoreRing";
import { PrimaryButton, SecondaryButton } from "../ui/PrimaryButton";
import { careerHealthApi } from "../../services/careerHealth";
import { parseDecimal } from "../../lib/parseNumeric";
import { getHealthStatus, localizeLevelLabel } from "../../lib/status";
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
	const statusVariant = result
		? getHealthStatus(result.status || result.level, score ?? undefined)
		: "neutral";

	return (
		<section aria-label="Ringkasan Kesehatan Karier" className="mb-7">
			<Card
				variant="hero"
				padding="lg"
				className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
				<ScoreRing
					value={score}
					max={100}
					size={148}
					stroke={12}
					status={statusVariant}
					suffix="/100"
					label="Skor Kesehatan Karier"
				/>

				<div className="flex-1 min-w-0 text-center md:text-left">
					<div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-2">
						<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
							<HeartPulse size={15} className="text-indigo-600" />
							<span>Kesehatan Karier</span>
						</span>
						{result && (
							<StatusBadge
								label={localizeLevelLabel(result.status)}
								variant={statusVariant}
							/>
						)}
					</div>

					{result ? (
						<>
							<h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
								{statusVariant === "healthy"
									? "Fondasi kariermu berada di posisi yang sehat."
									: statusVariant === "warning"
										? "Fondasi kariermu cukup stabil dengan beberapa celah penguatan."
										: "Ada beberapa aspek penting yang perlu segera diperhatikan."}
							</h2>
							<p className="text-sm text-slate-600 mt-2 leading-relaxed line-clamp-2 max-w-2xl">
								{result.summary}
							</p>
						</>
					) : (
						<>
							<h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
								Ukur titik awal ketahanan kariermu
							</h2>
							<p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-xl">
								Belum ada penilaian karier. Luangkan 2 menit untuk memetakan
								kekuatan peran, pencapaian, dan kesiapanmu menghadapi perubahan.
							</p>
						</>
					)}

					<div className="mt-5 flex flex-wrap items-center justify-center md:justify-start gap-3">
						{result ? (
							<Link to="/dashboard/kesehatan-karier">
								<SecondaryButton icon={<ArrowRight size={15} />}>
									Lihat Analisis Kesehatan
								</SecondaryButton>
							</Link>
						) : (
							<PrimaryButton onClick={openCareerAssessment}>
								Mulai Penilaian Karier
							</PrimaryButton>
						)}
					</div>
				</div>
			</Card>
		</section>
	);
}
