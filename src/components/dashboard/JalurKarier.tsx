import { useState } from "react";
import { Upload } from "lucide-react";
import PageHeader from "../layouts/PageHeader";
import CareerPathMap from "./CareerPathMap";
import RoleDetailPanel from "./RoleDetailPanel";
import PrepTimeCard from "./PrepTimeCard";
import { PrimaryButton } from "../ui/PrimaryButton";

interface OnboardingData {
	role?: string;
	dailyActivities?: string;
	skills?: string[];
}

interface JalurKarierForm {
	role: string;
	responsibilities: string;
	skills: string;
	tools_and_methods: string;
	work_experience: string;
	job_description: string;
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

export default function JalurKarier() {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const onboarding = getOnboardingData();
	const [form, setForm] = useState<JalurKarierForm>({
		role: onboarding.role ?? "",
		responsibilities: onboarding.dailyActivities ?? "",
		skills: onboarding.skills?.join(", ") ?? "",
		tools_and_methods: "",
		work_experience: "",
		job_description: "",
	});
	const [jobFileName, setJobFileName] = useState<string>("");

	const updateField = (key: keyof JalurKarierForm, value: string) =>
		setForm((prev) => ({ ...prev, [key]: value }));

	const handleSubmit = () => {
		console.log("Jalur karier data:", form);
		setIsModalOpen(false);
	};

	return (
		<div>
			<PageHeader
				title="Jalur Karier"
				subtitle="Kalau suatu hari kamu harus berpindah, kamu bisa ke mana?"
			/>

			<div className="mb-6">
				<PrimaryButton
					icon={<Upload size={14} />}
					onClick={() => setIsModalOpen(true)}>
					Lengkapi Data Jalur Karier
				</PrimaryButton>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
				<div className="lg:col-span-2">
					<CareerPathMap />
				</div>
				<div>
					<RoleDetailPanel />
					<PrepTimeCard />
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
									Lengkapi Data Jalur Karier
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
									Tanggung Jawab & Pekerjaan{" "}
									<span className="text-red-500">*</span>
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
									Skill <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									value={form.skills}
									onChange={(e) => updateField("skills", e.target.value)}
									placeholder="Pisahkan dengan koma. Contoh: Problem Solving, Communication"
									className={inputClass}
								/>
								<p className="text-xs text-neutral/50 mt-2">
									Pisahkan tiap skill dengan koma (,).
								</p>
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

							<div>
								<label className="block text-xs font-semibold text-neutral mb-2">
									Pengalaman Kerja (opsional)
								</label>
								<textarea
									rows={3}
									value={form.work_experience}
									onChange={(e) =>
										updateField("work_experience", e.target.value)
									}
									placeholder="Pengalaman yang relevan dengan pekerjaan saat ini."
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
									onChange={(e) =>
										updateField("job_description", e.target.value)
									}
									placeholder="Deskripsi pekerjaanmu jika tersedia."
									className={`${inputClass} resize-none`}
								/>
								<input
									type="file"
									onChange={(e) =>
										setJobFileName(e.target.files?.[0]?.name ?? "")
									}
									className="mt-2 w-full text-xs text-neutral/60 file:mr-3 file:py-2 file:px-4 file:rounded-2xl file:border-0 file:bg-primary/10 file:text-primary file:font-medium hover:file:bg-primary/20"
								/>
								{jobFileName && (
									<p className="text-xs text-neutral/60 mt-1">
										File terpilih: {jobFileName}
									</p>
								)}
							</div>
						</div>

						<div className="mt-8 pt-6 border-t border-neutral/10 flex items-center justify-end gap-3">
							<button
								type="button"
								onClick={() => setIsModalOpen(false)}
								className="px-5 py-2.5 text-sm font-medium rounded-full border border-neutral/20 text-neutral hover:bg-tertiary transition cursor-pointer">
								Batal
							</button>
							<PrimaryButton onClick={handleSubmit}>Simpan Data</PrimaryButton>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}