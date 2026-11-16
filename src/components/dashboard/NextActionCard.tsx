import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Compass } from "lucide-react";
import Skeleton from "../ui/Skeleton";
import IconTile from "../ui/IconTile";
import Card from "../ui/Card";
import { PrimaryButton } from "../ui/PrimaryButton";
import { aiExposureApi } from "../../services/aiExposure";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";
import type { AiExposureResult } from "../../types/aiExposure";

export default function NextActionCard() {
	const { refreshKey, openCareerAssessment } = useCareerAssessment();

	const [result, setResult] = useState<AiExposureResult | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;
		aiExposureApi
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

	const skillToImprove = result?.skills_to_improve[0] ?? null;
	const risingSkill = result?.rising_skills[0] ?? null;

	return (
		<Card
			padding="lg"
			className="border-indigo-200/80 bg-white">
			<div className="flex flex-wrap items-center justify-between gap-2 mb-4">
				<div className="inline-flex items-center gap-2.5">
					<IconTile icon={Compass} tone="indigo" size="sm" />
					<div>
						<h3 className="text-sm font-bold text-slate-900">
							Langkah Berikutnya
						</h3>
						<p className="text-xs text-slate-500">
							Satu tindakan paling berdampak yang bisa kamu ambil saat ini
						</p>
					</div>
				</div>

				<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
					<Clock size={12} />
					~10 menit
				</span>
			</div>

			{loading ? (
				<div className="space-y-2.5 my-3">
					<Skeleton className="h-5 w-3/4" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-10 w-44 rounded-xl mt-3" />
				</div>
			) : skillToImprove ? (
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div className="min-w-0">
						<p className="text-base sm:text-lg font-bold text-slate-900">
							Perkuat & dokumentasikan{" "}
							<span className="text-indigo-700">"{skillToImprove}"</span>
						</p>
						<p className="text-sm text-slate-600 mt-1 leading-relaxed line-clamp-2">
							{risingSkill
								? `Padukan dengan "${risingSkill}" lalu catat satu bukti hasil kerjamu agar posisi tawar kariermu makin kuat.`
								: "Tambahkan satu contoh nyata penerapan skill ini ke Bukti Karier agar portofoliomu siap kapan saja."}
						</p>
					</div>

					<Link to="/dashboard/skill" className="shrink-0">
						<PrimaryButton icon={<ArrowRight size={15} />}>
							Pelajari di Skill & AI
						</PrimaryButton>
					</Link>
				</div>
			) : (
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div className="min-w-0">
						<p className="text-base sm:text-lg font-bold text-slate-900">
							Petakan aktivitas kerja & dampak AI pada peranmu
						</p>
						<p className="text-sm text-slate-600 mt-1 leading-relaxed line-clamp-2">
							Lengkapi data karier singkat agar Jalur B dapat menyarankan skill
							prioritas dan jalur alternatif untukmu.
						</p>
					</div>

					<div className="shrink-0">
						<PrimaryButton onClick={openCareerAssessment}>
							Lengkapi Data Karier
						</PrimaryButton>
					</div>
				</div>
			)}
		</Card>
	);
}
