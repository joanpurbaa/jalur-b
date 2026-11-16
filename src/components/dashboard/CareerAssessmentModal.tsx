import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { PrimaryButton } from "../ui/PrimaryButton";
import { careerHealthApi } from "../../services/careerHealth";
import { careerRiskApi } from "../../services/careerRisk";
import { aiExposureApi } from "../../services/aiExposure";
import { careerPivotApi } from "../../services/careerPivot";
import { profileApi } from "../../services/profile";
import { ApiError } from "../../types/api";
import type { CareerAssessmentRequest } from "../../types/careerHealth";

interface OnboardingData {
	role?: string;
	industry?: string;
	dailyActivities?: string;
}

interface CareerAssessmentForm {
	role_name: string;
	industry_name: string;
	work_duration_months: string;
	responsibilities: string;
	achievements: string;
	performance_feedback: string;
	career_progression: string;
	job_description: string;
	tools_and_methods: string;
}

interface AssessmentStep {
	label: string;
	run: (payload: CareerAssessmentRequest) => Promise<unknown>;
}

const inputClass =
	"w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/25 text-sm text-slate-900 placeholder:text-slate-400 transition";

function getOnboardingData(): OnboardingData {
	try {
		const raw = localStorage.getItem("jalurB_onboarding");
		return raw ? (JSON.parse(raw) as OnboardingData) : {};
	} catch {
		return {};
	}
}

const ASSESSMENT_STEPS: AssessmentStep[] = [
	{ label: "Kesehatan Karier", run: (p) => careerHealthApi.create(p) },
	{ label: "Risiko Karier", run: (p) => careerRiskApi.create(p) },
	{ label: "Skill & AI", run: (p) => aiExposureApi.create(p) },
	{ label: "Jalur Karier", run: (p) => careerPivotApi.create(p) },
];

interface CareerAssessmentModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSaved: () => void;
}

export default function CareerAssessmentModal({
	isOpen,
	onClose,
	onSaved,
}: CareerAssessmentModalProps) {
	const onboarding = getOnboardingData();

	const [form, setForm] = useState<CareerAssessmentForm>({
		role_name: onboarding.role ?? "",
		industry_name: onboarding.industry ?? "",
		work_duration_months: "",
		responsibilities: onboarding.dailyActivities ?? "",
		achievements: "",
		performance_feedback: "",
		career_progression: "",
		job_description: "",
		tools_and_methods: "",
	});
	const [feedbackFileName, setFeedbackFileName] = useState<string>("");
	const [submitting, setSubmitting] = useState(false);
	const [currentStep, setCurrentStep] = useState<number | null>(null);
	const [submitError, setSubmitError] = useState<string | null>(null);

	useEffect(() => {
		if (!isOpen) return;
		let active = true;
		profileApi
			.get()
			.then((res) => {
				if (!active) return;
				const p = res.profile;
				setForm((prev) => ({
					...prev,
					role_name: prev.role_name || p.current_role_name || "",
					industry_name: prev.industry_name || p.industry_name || "",
					work_duration_months:
						prev.work_duration_months ||
						(p.work_duration_months != null
							? String(p.work_duration_months)
							: ""),
				}));
			})
			.catch(() => {
				// profil belum tersedia — gunakan data onboarding dari localStorage
			});
		return () => {
			active = false;
		};
	}, [isOpen]);

	const updateField = (key: keyof CareerAssessmentForm, value: string) =>
		setForm((prev) => ({ ...prev, [key]: value }));

	const handleSubmit = async () => {
		if (submitting) return;
		setSubmitting(true);
		setSubmitError(null);
		try {
			const payload: CareerAssessmentRequest = {
				role_name: form.role_name.trim(),
				industry_name: form.industry_name.trim(),
				work_duration_months: Number(form.work_duration_months) || 0,
				responsibilities: form.responsibilities.trim(),
				achievements: form.achievements.trim(),
				performance_feedback: form.performance_feedback.trim(),
				career_progression: form.career_progression.trim(),
				job_description: form.job_description.trim(),
				tools_and_methods: form.tools_and_methods.trim(),
			};
			for (let i = 0; i < ASSESSMENT_STEPS.length; i++) {
				setCurrentStep(i);
				await ASSESSMENT_STEPS[i].run(payload);
			}
			setCurrentStep(null);
			onSaved();
		} catch (error) {
			const message =
				error instanceof ApiError
					? error.message
					: "Terjadi kesalahan yang tidak diketahui.";
			setSubmitError(message);
		} finally {
			setSubmitting(false);
		}
	};

	if (!isOpen) return null;

	const canSubmit =
		form.role_name.trim() !== "" &&
		form.industry_name.trim() !== "" &&
		(Number(form.work_duration_months) > 0 ||
			form.work_duration_months.trim() !== "") &&
		form.responsibilities.trim() !== "";

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]"
			onClick={onClose}>
			<div
				className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200"
				onClick={(e) => e.stopPropagation()}>
				<div className="flex items-start justify-between mb-6 gap-4">
					<div>
						<h2 className="text-xl sm:text-2xl font-bold text-slate-900">
							Lengkapi Data Karier
						</h2>
						<p className="text-sm text-slate-500 mt-1 leading-relaxed">
							Satu kali simpan — berlaku untuk semua analisis: Kesehatan
							Karier, Risiko Karier, Skill &amp; AI, dan Jalur Karier.
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="Tutup modal"
						className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0">
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

				{submitting && !submitError ? (
					<div className="py-6 flex flex-col items-center text-center">
						<div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4">
							<Loader2 size={22} className="text-indigo-600 animate-spin" />
						</div>
						<h3 className="text-lg font-bold text-slate-900">
							Menganalisis data kariermu…
						</h3>
						<p className="text-sm text-slate-500 mt-1 mb-7">
							Semua modul penilaian sedang diproses satu per satu secara
							real-time.
						</p>

						<div className="w-full max-w-sm space-y-2.5">
							{ASSESSMENT_STEPS.map((step, i) => {
								const done = i < (currentStep ?? -1);
								const running = i === currentStep;
								return (
									<div
										key={step.label}
										className={`flex items-center gap-3 p-3.5 rounded-xl border transition ${
											running
												? "border-indigo-200 bg-indigo-50/70"
												: done
													? "border-emerald-200 bg-emerald-50/60"
													: "border-slate-200 bg-white"
										}`}>
										<div
											className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
												done
													? "bg-emerald-600"
													: running
														? "bg-indigo-600"
														: "bg-slate-100"
											}`}>
											{done ? (
												<Check size={15} className="text-white" />
											) : running ? (
												<Loader2 size={15} className="text-white animate-spin" />
											) : (
												<span className="text-xs font-semibold text-slate-500">
													{i + 1}
												</span>
											)}
										</div>
										<div className="flex-1 text-left min-w-0">
											<p
												className={`text-sm font-semibold ${
													running
														? "text-slate-900"
														: done
															? "text-emerald-800"
															: "text-slate-500"
												}`}>
												{step.label}
											</p>
											{running && (
												<p className="text-xs text-indigo-700">
													Sedang menganalisis…
												</p>
											)}
											{done && (
												<p className="text-xs text-emerald-700">Selesai</p>
											)}
										</div>
										{done && (
											<span className="text-xs font-semibold text-emerald-700 shrink-0">
												Berhasil
											</span>
										)}
									</div>
								);
							})}
						</div>
					</div>
				) : (
					<div className="space-y-5">
						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1.5">
								Role / Jabatan <span className="text-rose-600">*</span>
							</label>
						<input
							type="text"
							value={form.role_name}
							onChange={(e) => updateField("role_name", e.target.value)}
							placeholder="Contoh: Software Engineer, Product Manager"
							className={inputClass}
						/>
					</div>

					<div>
						<label className="block text-xs font-semibold text-slate-700 mb-1.5">
							Bidang / Industri <span className="text-rose-600">*</span>
						</label>
						<input
							type="text"
							value={form.industry_name}
							onChange={(e) => updateField("industry_name", e.target.value)}
							placeholder="Contoh: Technology, Finance"
							className={inputClass}
						/>
					</div>

					<div>
						<label className="block text-xs font-semibold text-slate-700 mb-1.5">
							Lama Bekerja (bulan) <span className="text-rose-600">*</span>
						</label>
						<input
							type="text"
							inputMode="numeric"
							value={form.work_duration_months}
							onChange={(e) =>
								updateField(
									"work_duration_months",
									e.target.value.replace(/\D/g, ""),
								)
							}
							placeholder="Contoh: 48"
							className={inputClass}
						/>
						<p className="text-xs text-slate-500 mt-1.5">
							Dihitung dalam bulan, misalnya 3 tahun = 36 bulan.
						</p>
					</div>

					<div>
						<label className="block text-xs font-semibold text-slate-700 mb-1.5">
							Tanggung Jawab &amp; Pekerjaan <span className="text-rose-600">*</span>
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
						<label className="block text-xs font-semibold text-slate-700 mb-1.5">
							Pencapaian (opsional)
						</label>
						<textarea
							rows={3}
							value={form.achievements}
							onChange={(e) => updateField("achievements", e.target.value)}
							placeholder="Pencapaian atau hasil kerja yang pernah dicapai."
							className={`${inputClass} resize-none`}
						/>
					</div>

					<div>
						<label className="block text-xs font-semibold text-slate-700 mb-1.5">
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
							className="mt-2 w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border file:border-indigo-200 file:bg-indigo-50 file:text-indigo-700 file:font-medium hover:file:bg-indigo-100 file:cursor-pointer"
						/>
						{feedbackFileName && (
							<p className="text-xs text-slate-600 mt-1">
								File terpilih: {feedbackFileName}
							</p>
						)}
					</div>

					<div>
						<label className="block text-xs font-semibold text-slate-700 mb-1.5">
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

					<div>
						<label className="block text-xs font-semibold text-slate-700 mb-1.5">
							Deskripsi Pekerjaan (opsional)
						</label>
						<textarea
							rows={3}
							value={form.job_description}
							onChange={(e) => updateField("job_description", e.target.value)}
							placeholder="Deskripsi pekerjaanmu jika tersedia."
							className={`${inputClass} resize-none`}
						/>
					</div>

					<div>
						<label className="block text-xs font-semibold text-slate-700 mb-1.5">
							Tools &amp; Metode (opsional)
						</label>
						<input
							type="text"
							value={form.tools_and_methods}
							onChange={(e) =>
								updateField("tools_and_methods", e.target.value)
							}
							placeholder="Pisahkan dengan koma. Contoh: Figma, Agile, SQL"
							className={inputClass}
						/>
						<p className="text-xs text-slate-500 mt-1.5">
							Pisahkan tiap tools/metode dengan koma (,).
						</p>
					</div>
				</div>
				)}

				{submitError && (
					<div className="mt-4 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200">
						<p className="text-xs font-semibold text-rose-800 mb-0.5">
							Gagal menjalankan penilaian
						</p>
						<p className="text-xs text-rose-700">{submitError}</p>
					</div>
				)}

				<div className="mt-8 pt-5 border-t border-slate-200">
					<div className="flex items-center justify-end gap-3">
						<button
							type="button"
							onClick={onClose}
							disabled={submitting}
							className="min-h-[44px] px-5 py-2.5 text-sm font-medium rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-40">
							Batal
						</button>
						<PrimaryButton
							onClick={() => void handleSubmit()}
							disabled={!canSubmit || submitting}>
							{submitting ? "Memproses…" : "Simpan Data"}
						</PrimaryButton>
					</div>
				</div>
			</div>
		</div>
	);
}