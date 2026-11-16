import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Flame, Sparkles } from "lucide-react";
import Skeleton from "../ui/Skeleton";
import IconTile from "../ui/IconTile";
import Card from "../ui/Card";
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
			lift
			padding="lg"
			className="relative overflow-hidden border-2 border-indigo-200/90 bg-gradient-to-br from-white via-indigo-50/40 to-amber-50/50">
			<div className="flex flex-wrap items-center justify-between gap-2 mb-4">
				<div className="inline-flex items-center gap-2">
					<IconTile icon={Flame} tone="risiko-karier" size="sm" />
					<div>
						<span className="text-xs font-extrabold uppercase tracking-wider text-amber-700">
							Langkah Hari Ini
						</span>
						<p className="text-xs text-neutral/55">
							Satu aksi kecil yang paling berdampak sekarang
						</p>
					</div>
				</div>

				<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-800 border border-amber-200 text-xs font-bold">
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
						<h3 className="text-lg sm:text-xl font-extrabold text-neutral">
							Latih & dokumentasikan skill{" "}
							<span className="text-indigo-600">"{skillToImprove}"</span>
						</h3>
						<p className="text-sm text-neutral/70 mt-1 leading-relaxed">
							{risingSkill
								? `Padukan dengan "${risingSkill}" lalu catat 1 bukti hasil kerjamu agar posisi tawar kariermu makin kuat.`
								: "Tambahkan 1 contoh nyata penerapan skill ini ke Bukti Karier agar portofoliomu siap kapan saja."}
						</p>
					</div>

					<Link
						to="/dashboard/skill"
						className="press shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold shadow-[0_10px_22px_-8px_rgba(79,70,229,0.55)] hover:brightness-105">
						Mulai Sekarang
						<ArrowRight size={16} />
					</Link>
				</div>
			) : (
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div className="min-w-0">
						<h3 className="text-lg sm:text-xl font-extrabold text-neutral">
							Petakan tugas harian & dampak AI pada peranmu
						</h3>
						<p className="text-sm text-neutral/70 mt-1 leading-relaxed">
							Isi data karier singkat supaya Jalur B bisa merekomendasikan 1
							skill prioritas yang paling relevan untuk kamu kuasai minggu ini.
						</p>
					</div>

					<button
						type="button"
						onClick={openCareerAssessment}
						className="press shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold shadow-[0_10px_22px_-8px_rgba(79,70,229,0.55)] cursor-pointer">
						<Sparkles size={16} />
						Lengkapi Data Karier
					</button>
				</div>
			)}
		</Card>
	);
}
