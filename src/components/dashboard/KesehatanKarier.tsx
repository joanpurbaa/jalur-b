import {
	TrendingUp,
	Zap,
	RefreshCw,
	Plane,
	Wallet,
	Upload,
	Sparkles,
} from "lucide-react";
import PageHeader from "../layouts/PageHeader";
import { careerHealthData } from "../../data/dashboardDummyData";
import { getScoreStatus } from "../../lib/status";
import StatusBadge from "../ui/StatusBadge";
import ProgressBar from "../ui/ProgressBar";
import { useState } from "react";
import { PrimaryButton } from "../ui/PrimaryButton";
import FactorCard from "./FactorCard";

interface OnboardingData {
	role?: string;
	industry?: string;
	experience?: string;
	dailyActivities?: string;
}

interface CareerHealthForm {
	role: string;
	industry: string;
	work_duration: string;
	responsibilities: string;
	achievements: string;
	performance_feedback: string;
	career_progression: string;
}

const inputClass =
	"w-full px-4 py-3 rounded-2xl border border-neutral/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm text-neutral placeholder:text-neutral/40";

function getOnboardingData(): OnboardingData {
	try {
		const raw = localStorage.getItem("jalurB_onboarding");
		return raw ? (JSON.parse(raw) as OnboardingData) : {};
	} catch {
		return {};
	}
}

const factors = [
	{ title: "Performa & Perkembangan", score: 80, icon: TrendingUp },
	{ title: "Relevansi Skill", score: 81, icon: Zap },
	{ title: "Adaptasi Perubahan", score: 68, icon: RefreshCw },
	{ title: "Kesiapan Berpindah", score: 57, icon: Plane },
	{ title: "Financial Readiness", score: 52, icon: Wallet },
];

export default function KesehatanKarier() {
	const status = getScoreStatus(careerHealthData.score);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const onboarding = getOnboardingData();
	const [form, setForm] = useState<CareerHealthForm>({
		role: onboarding.role ?? "",
		industry: onboarding.industry ?? "",
		work_duration: onboarding.experience ?? "",
		responsibilities: onboarding.dailyActivities ?? "",
		achievements: "",
		performance_feedback: "",
		career_progression: "",
	});
	const [feedbackFileName, setFeedbackFileName] = useState<string>("");

	const updateField = (key: keyof CareerHealthForm, value: string) =>
		setForm((prev) => ({ ...prev, [key]: value }));

	const handleSubmit = () => {
		console.log("Career health data:", form);
		setIsModalOpen(false);
	};

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
						<PrimaryButton
							icon={<Upload size={14} />}
							fullWidth
							onClick={() => setIsModalOpen(true)}>
							Lengkapi Data Karier
						</PrimaryButton>
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

			{isModalOpen && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral/40 backdrop-blur-sm"
					onClick={() => setIsModalOpen(false)}>
					<div
						className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral/5"
						onClick={(e) => e.stopPropagation()}>
						<div className="flex items-start justify-between mb-6">
							<div>
								<h2 className="text-xl sm:text-2xl font-bold text-neutral">
									Lengkapi Data Karier
								</h2>
								<p className="text-sm text-neutral/60 mt-1">
									Data yang sama dengan onboarding sudah kami isi otomatis.
								</p>
							</div>
							<button
								type="button"
								onClick={() => setIsModalOpen(false)}
								className="text-neutral/40 hover:text-neutral transition cursor-pointer">
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						<div className="space-y-5">
							<div>
								<label className="block text-xs font-semibold text-neutral mb-2">
									Role / Jabatan <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									value={form.role}
									onChange={(e) => updateField("role", e.target.value)}
									placeholder="Contoh: Software Engineer, Product Manager"
									className={inputClass}
								/>
							</div>

							<div>
								<label className="block text-xs font-semibold text-neutral mb-2">
									Bidang / Industri <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									value={form.industry}
									onChange={(e) => updateField("industry", e.target.value)}
									placeholder="Contoh: Technology, Finance"
									className={inputClass}
								/>
							</div>

							<div>
								<label className="block text-xs font-semibold text-neutral mb-2">
									Lama Bekerja <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									value={form.work_duration}
									onChange={(e) =>
										updateField("work_duration", e.target.value)
									}
									placeholder="Contoh: 3–5 tahun"
									className={inputClass}
								/>
							</div>

							<div>
								<label className="block text-xs font-semibold text-neutral mb-2">
									Tanggung Jawab & Pekerjaan <span className="text-red-500">*</span>
								</label>
								<textarea
									rows={4}
									value={form.responsibilities}
									onChange={(e) =>
										updateField("responsibilities", e.target.value)
									}
									placeholder="Deskripsi singkat pekerjaan dan tanggung jawab utama."
									className={`${inputClass} resize-none`}
								/>
							</div>

							<div>
								<label className="block text-xs font-semibold text-neutral mb-2">
									Pencapaian (opsional)
								</label>
								<textarea
									rows={3}
									value={form.achievements}
									onChange={(e) =>
										updateField("achievements", e.target.value)
									}
									placeholder="Pencapaian atau hasil kerja yang pernah dicapai."
									className={`${inputClass} resize-none`}
								/>
							</div>

							<div>
								<label className="block text-xs font-semibold text-neutral mb-2">
									Feedback / Performance Review (opsional)
								</label>
								<textarea
									rows={3}
									value={form.performance_feedback}
									onChange={(e) =>
										updateField("performance_feedback", e.target.value)
									}
									placeholder="Feedback, performance review, atau evaluasi yang diterima."
									className={`${inputClass} resize-none`}
								/>
								<input
									type="file"
									onChange={(e) =>
										setFeedbackFileName(e.target.files?.[0]?.name ?? "")
									}
									className="mt-2 w-full text-xs text-neutral/60 file:mr-3 file:py-2 file:px-4 file:rounded-2xl file:border-0 file:bg-primary/10 file:text-primary file:font-medium hover:file:bg-primary/20"
								/>
								{feedbackFileName && (
									<p className="text-xs text-neutral/60 mt-1">
										File terpilih: {feedbackFileName}
									</p>
								)}
							</div>

							<div>
								<label className="block text-xs font-semibold text-neutral mb-2">
									Riwayat Perkembangan Karier (opsional)
								</label>
								<textarea
									rows={3}
									value={form.career_progression}
									onChange={(e) =>
										updateField("career_progression", e.target.value)
									}
									placeholder="Promosi, perpindahan tanggung jawab, atau perubahan posisi."
									className={`${inputClass} resize-none`}
								/>
							</div>
						</div>

						<div className="mt-8 pt-6 border-t border-neutral/10 flex items-center justify-end gap-3">
							<button
								type="button"
								onClick={() => setIsModalOpen(false)}
								className="px-5 py-2.5 text-sm font-medium rounded-full border border-neutral/20 text-neutral hover:bg-tertiary transition cursor-pointer">
								Batal
							</button>
							<PrimaryButton onClick={handleSubmit}>
								Simpan Data
							</PrimaryButton>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
