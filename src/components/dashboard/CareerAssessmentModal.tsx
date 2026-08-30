import { useEffect, useState } from "react";
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
	"w-full px-4 py-3 rounded-2xl border border-neutral/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm text-neutral placeholder:text-neutral/40";

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
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral/40 backdrop-blur-sm"
			onClick={onClose}>
			<div
				className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral/5"
				onClick={(e) => e.stopPropagation()}>
				<div className="flex items-start justify-between mb-6">
					<div>
						<h2 className="text-xl sm:text-2xl font-bold text-neutral">
							Lengkapi Data Karier
						</h2>
						<p className="text-sm text-neutral/60 mt-1">
Satu kali simpan — berlaku untuk semua analisis: Kesehatan
						Karier, Risiko Karier, Skill &amp; AI, dan Jalur Karier.
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
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
							value={form.role_name}
							onChange={(e) => updateField("role_name", e.target.value)}
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
							value={form.industry_name}
							onChange={(e) => updateField("industry_name", e.target.value)}
							placeholder="Contoh: Technology, Finance"
							className={inputClass}
						/>
					</div>

					<div>
						<label className="block text-xs font-semibold text-neutral mb-2">
							Lama Bekerja (bulan) <span className="text-red-500">*</span>
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
						<p className="text-xs text-neutral/50 mt-2">
							Dihitung dalam bulan, misalnya 3 tahun = 36 bulan.
						</p>
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
							onChange={(e) => updateField("achievements", e.target.value)}
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

					<div>
						<label className="block text-xs font-semibold text-neutral mb-2">
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
						<label className="block text-xs font-semibold text-neutral mb-2">
							Tools & Metode (opsional)
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
						<p className="text-xs text-neutral/50 mt-2">
							Pisahkan tiap tools/metode dengan koma (,).
						</p>
					</div>
				</div>

				{submitError && (
					<div className="mt-4 px-4 py-3 rounded-2xl bg-red-50 border border-red-100">
						<p className="text-xs font-semibold text-red-600 mb-0.5">
							Gagal menjalankan penilaian
						</p>
						<p className="text-xs text-red-500">{submitError}</p>
					</div>
				)}

				<div className="mt-8 pt-6 border-t border-neutral/10">
					{submitting && (
						<div className="mb-4 space-y-1.5">
							{ASSESSMENT_STEPS.map((step, i) => (
								<div
									key={step.label}
									className="flex items-center gap-2 text-xs">
									<span
										className={`w-2 h-2 rounded-full ${
											i < (currentStep ?? -1)
												? "bg-emerald-500"
												: i === currentStep
													? "bg-primary animate-pulse"
													: "bg-neutral/20"
										}`}
									/>
									<span
										className={
											i <= (currentStep ?? -1)
												? "text-neutral/70"
												: "text-neutral/40"
										}>
										{step.label}
									</span>
								</div>
							))}
						</div>
					)}

					<div className="flex items-center justify-end gap-3">
						<button
							type="button"
							onClick={onClose}
							disabled={submitting}
							className="px-5 py-2.5 text-sm font-medium rounded-full border border-neutral/20 text-neutral hover:bg-tertiary transition cursor-pointer disabled:opacity-40">
							Batal
						</button>
						<PrimaryButton
							onClick={() => void handleSubmit()}
							disabled={!canSubmit || submitting}>
							{submitting
								? currentStep != null
									? `Menganalisis ${ASSESSMENT_STEPS[currentStep].label}...`
									: "Menyimpan..."
								: "Simpan Data"}
						</PrimaryButton>
					</div>
				</div>
			</div>
		</div>
	);
}