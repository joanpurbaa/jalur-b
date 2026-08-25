import {
	TrendingUp,
	Zap,
	RefreshCw,
	Plane,
	Wallet,
	Upload,
	PlusCircle,
	Sparkles,
} from "lucide-react";
import PageHeader from "../layouts/PageHeader";
import { careerHealthData } from "../../data/dashboardDummyData";
import { getScoreStatus } from "../../lib/status";
import StatusBadge from "../ui/StatusBadge";
import ProgressBar from "../ui/ProgressBar";
import { PrimaryButton } from "../ui/PrimaryButton";
import { SecondaryButton } from "../ui/PrimaryButton";
import FactorCard from "./FactorCard";

const factors = [
	{ title: "Performa & Perkembangan", score: 80, icon: TrendingUp },
	{ title: "Relevansi Skill", score: 81, icon: Zap },
	{ title: "Adaptasi Perubahan", score: 68, icon: RefreshCw },
	{ title: "Kesiapan Berpindah", score: 57, icon: Plane },
	{ title: "Financial Readiness", score: 52, icon: Wallet },
];

export default function KesehatanKarier() {
	const status = getScoreStatus(careerHealthData.score);

	return (
		<div>
			<PageHeader
				title="Kesehatan Karier"
				subtitle="Lihat seberapa kuat posisi kariermu saat ini dan apa yang perlu diperhatikan."
			/>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
				<div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-neutral/5 shadow-md flex flex-col justify-center">
					<h2 className="text-xl font-bold text-neutral">Skor Kesehatan Karier</h2>
					<div className="flex items-baseline gap-3 mt-4">
						<span className="text-5xl font-extrabold text-neutral">
							{careerHealthData.score}
							<span className="text-2xl text-neutral/40 font-normal">/100</span>
						</span>
						<StatusBadge label={careerHealthData.status} variant={status} />
					</div>
					<p className="text-sm text-neutral/60 mt-4 leading-relaxed max-w-lg">
						Kondisi kariermu saat ini relatif stabil, tetapi kesiapan berpindah dan
						ketergantungan pada beberapa skill masih perlu diperhatikan.
					</p>
				</div>

				<div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 flex flex-col justify-between">
					<div>
						<div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-3">
							<Sparkles size={16} />
							<span>AI Insight</span>
						</div>
						<p className="text-xs text-neutral/70 leading-relaxed">
							Semakin banyak data yang kamu tambahkan, semakin akurat analisis Jalur B.
						</p>

						<div className="mt-4">
							<div className="flex justify-between items-center text-xs mb-1.5 font-medium">
								<span className="text-neutral/60">Akurasi analisismu</span>
								<span className="text-primary font-bold">68%</span>
							</div>
							<ProgressBar value={68} variant="insight" />
						</div>
					</div>

					<div className="space-y-2.5 mt-6">
						<PrimaryButton icon={<Upload size={14} />} fullWidth>
							Upload Performance Review
						</PrimaryButton>
						<SecondaryButton icon={<PlusCircle size={14} />} fullWidth>
							Tambah Feedback
						</SecondaryButton>
					</div>
				</div>
			</div>

			<div>
				<h3 className="text-sm font-bold text-neutral mb-3">
					Faktor Kesehatan Karier
				</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{factors.map((item) => (
						<FactorCard
							key={item.title}
							title={item.title}
							score={item.score}
							icon={item.icon}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
