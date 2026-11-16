import { useEffect, useRef, useState } from "react";
import { Briefcase, CheckCircle2, FileText, Sparkles, Upload } from "lucide-react";
import SkillPill, { type SkillPillTone } from "../ui/SkillPill";
import IconTile from "../ui/IconTile";
import Skeleton from "../ui/Skeleton";
import { SecondaryButton } from "../ui/PrimaryButton";
import { initials as getInitials } from "../../lib/format";
import { ApiError } from "../../types/api";
import { cvApi } from "../../services/cv";
import type { CvGetResponse, CvPreviewResponse } from "../../types/cv";
import type { OnboardingSkill } from "../../types/onboarding";

interface CareerExperienceCardProps {
	skills?: OnboardingSkill[];
	loading?: boolean;
}

const AVATAR_GRADIENTS = [
	"from-indigo-500 to-violet-600",
	"from-emerald-500 to-teal-600",
	"from-sky-500 to-blue-600",
	"from-amber-500 to-orange-600",
	"from-rose-500 to-pink-600",
];

const SKILL_TONES: SkillPillTone[] = ["strong", "rising", "insight", "neutral"];

export default function CareerExperienceCard({
	skills,
	loading = false,
}: CareerExperienceCardProps) {
	const [cvData, setCvData] = useState<CvGetResponse | null>(null);
	const [cvLoading, setCvLoading] = useState(true);
	const [cvPreview, setCvPreview] = useState<CvPreviewResponse | null>(null);
	const [cvUploading, setCvUploading] = useState(false);
	const [cvError, setCvError] = useState<string>("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		let active = true;
		cvApi
			.get()
			.then((res) => {
				if (active) setCvData(res);
			})
			.catch(() => {
				// belum ada CV — biarkan null
			})
			.finally(() => {
				if (active) setCvLoading(false);
			});
		return () => {
			active = false;
		};
	}, []);

	const handleFile = (file: File) => {
		setCvError("");
		setCvUploading(true);
		cvApi
			.preview(file)
			.then((res) => {
				setCvPreview(res);
			})
			.catch((err) => {
				setCvError(
					err instanceof ApiError
						? err.message
						: "Gagal membaca CV. Coba dengan file lain.",
				);
			})
			.finally(() => {
				setCvUploading(false);
			});
	};

	const handleConfirm = () => {
		if (!cvPreview) return;
		setCvUploading(true);
		setCvError("");
		cvApi
			.confirm({
				preview_token: cvPreview.preview_token,
				profile: cvPreview.profile,
				skills: cvPreview.skills,
				experiences: cvPreview.experiences,
			})
			.then(() => {
				setCvPreview(null);
				setCvLoading(true);
				return cvApi.get();
			})
			.then((res) => {
				setCvData(res);
			})
			.catch((err) => {
				setCvError(
					err instanceof ApiError
						? err.message
						: "Gagal menyimpan CV. Silakan coba lagi.",
				);
			})
			.finally(() => {
				setCvUploading(false);
			});
	};

	const handleReset = () => {
		setCvPreview(null);
		setCvError("");
	};

	const hasCv = cvData !== null;
	const showPreview = cvPreview !== null;

	if (loading || cvLoading) {
		return (
			<div>
				<div className="space-y-3 mb-6">
					<Skeleton className="h-16 w-full rounded-xl" />
					<Skeleton className="h-16 w-full rounded-xl" />
				</div>
				<div className="flex flex-wrap gap-2 mb-6">
					<Skeleton className="h-8 w-24 rounded-lg" />
					<Skeleton className="h-8 w-20 rounded-lg" />
					<Skeleton className="h-8 w-28 rounded-lg" />
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<div className="flex items-center gap-2.5 mb-4">
					<IconTile icon={Briefcase} tone="beranda" size="xs" />
					<h4 className="text-sm font-extrabold text-neutral">
						Timeline Pengalaman Karier
					</h4>
				</div>

				{hasCv && !showPreview && cvData ? (
					cvData.experiences.length > 0 ? (
						<div className="relative pl-5 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:to-teal-400">
							{cvData.experiences.map((exp, i) => {
								const compInit = getInitials(exp.company) || "CO";
								const grad = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];
								return (
									<div
										key={`cv-exp-${i}`}
										className="relative rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 flex items-start gap-3.5">
										<span
											aria-hidden
											className="absolute -left-[19px] top-6 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white"
										/>
										<span
											className={`inline-flex w-10 h-10 rounded-2xl bg-gradient-to-br ${grad} text-white text-xs font-extrabold items-center justify-center shrink-0 shadow-xs`}>
											{compInit}
										</span>
										<div className="flex-1 min-w-0">
											<div className="flex items-center justify-between flex-wrap gap-1">
												<p className="text-sm font-extrabold text-neutral">
													{exp.role}
												</p>
												<span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-neutral/65">
													{exp.start_date} — {exp.end_date}
												</span>
											</div>
											<p className="text-xs font-bold text-indigo-700 mt-0.5">
												{exp.company}
											</p>
											{exp.description && (
												<p className="text-xs text-neutral/70 mt-1.5 leading-relaxed">
													{exp.description}
												</p>
											)}
										</div>
									</div>
								);
							})}
						</div>
					) : (
						<p className="text-xs text-neutral/55">
							Tidak ada riwayat pengalaman yang terdeteksi dari CV.
						</p>
					)
				) : showPreview && cvPreview ? (
					<div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50/50 p-4 space-y-4">
						<div className="flex items-center gap-3">
							<IconTile icon={CheckCircle2} tone="safe" size="sm" />
							<div>
								<p className="text-sm font-extrabold text-neutral">
									Pratinjau Ekstraksi CV
								</p>
								<p className="text-xs text-neutral/60">{cvPreview.file_name}</p>
							</div>
						</div>

						{cvPreview.experiences.length > 0 && (
							<div className="space-y-3">
								{cvPreview.experiences.map((exp, i) => (
									<div
										key={`preview-exp-${i}`}
										className="rounded-xl bg-white p-3.5 border border-slate-200">
										<p className="text-sm font-extrabold text-neutral">
											{exp.role}
										</p>
										<p className="text-xs font-bold text-indigo-700">
											{exp.company} · {exp.start_date} — {exp.end_date}
										</p>
										<p className="text-xs text-neutral/70 mt-1 leading-relaxed">
											{exp.description}
										</p>
									</div>
								))}
							</div>
						)}

						{cvPreview.skills.length > 0 && (
							<div className="flex flex-wrap gap-1.5">
								{cvPreview.skills.map((skill, idx) => (
									<SkillPill
										key={skill}
										label={skill}
										tone={SKILL_TONES[idx % SKILL_TONES.length]}
									/>
								))}
							</div>
						)}

						<div className="flex gap-2.5">
							<button
								type="button"
								onClick={handleConfirm}
								disabled={cvUploading}
								className={`press px-4 py-2 text-xs font-bold rounded-xl transition ${
									cvUploading
										? "bg-indigo-400 text-white cursor-not-allowed"
										: "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
								}`}>
								{cvUploading ? "Menyimpan…" : "Gunakan Data Ini"}
							</button>
							<button
								type="button"
								onClick={handleReset}
								disabled={cvUploading}
								className="press px-4 py-2 text-xs font-bold text-neutral/70 border border-slate-300 bg-white rounded-xl hover:bg-slate-50 transition cursor-pointer">
								Batal
							</button>
						</div>
					</div>
				) : (
					<div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-xs text-neutral/60">
						Belum ada timeline pengalaman karier. Unggah CV di bawah untuk
						mengekstrak riwayat kerja secara otomatis.
					</div>
				)}
			</div>

			<div>
				<div className="flex items-center gap-2.5 mb-3">
					<IconTile icon={Sparkles} tone="skill" size="xs" />
					<h4 className="text-sm font-extrabold text-neutral">
						Koleksi Skill ({skills?.length ?? 0})
					</h4>
				</div>

				{skills && skills.length > 0 ? (
					<div className="flex flex-wrap gap-2">
						{skills.map((skill, idx) => (
							<SkillPill
								key={skill.id}
								label={skill.name}
								tone={SKILL_TONES[idx % SKILL_TONES.length]}
							/>
						))}
					</div>
				) : (
					<p className="text-xs text-neutral/55">Belum ada skill yang dicatat.</p>
				)}
			</div>

			<div className="pt-4 border-t border-slate-100">
				<div className="flex items-center justify-between flex-wrap gap-3">
					<div className="flex items-center gap-3 min-w-0 flex-1">
						<IconTile icon={FileText} tone="bukti-karier" size="sm" />
						<div className="min-w-0">
							{hasCv && !showPreview ? (
								<>
									<p className="text-xs font-extrabold text-neutral">
										Berkas CV Terlampir
									</p>
									<p className="text-xs text-neutral/55">
										Diunggah{" "}
										{new Date(cvData!.uploaded_at).toLocaleDateString("id-ID", {
											day: "numeric",
											month: "long",
											year: "numeric",
										})}{" "}
										· Model {cvData!.model}
									</p>
								</>
							) : (
								<>
									<p className="text-xs font-extrabold text-neutral">
										Dokumen CV
									</p>
									<p className="text-xs text-neutral/55">
										Unggah PDF/DOCX untuk melengkapi pengalaman otomatis
									</p>
								</>
							)}
						</div>
					</div>

					{!showPreview && (
						<>
							<SecondaryButton
								size="sm"
								icon={<Upload size={14} className="text-indigo-600" />}
								onClick={() => fileInputRef.current?.click()}>
								{cvUploading
									? "Memproses..."
									: hasCv
										? "Ganti CV"
										: "Unggah CV"}
							</SecondaryButton>

							<input
								ref={fileInputRef}
								type="file"
								accept=".pdf,.doc,.docx"
								className="sr-only"
								onChange={(e) => {
									const file = e.target.files?.[0];
									if (file) handleFile(file);
									e.target.value = "";
								}}
							/>
						</>
					)}
				</div>

				{cvError && (
					<p className="text-xs text-rose-600 font-semibold mt-2">{cvError}</p>
				)}
			</div>
		</div>
	);
}
