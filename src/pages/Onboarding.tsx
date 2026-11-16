import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	ArrowRight,
	Award,
	Briefcase,
	Building2,
	Check,
	Clock,
	Compass,
	FileText,
	GitFork,
	HelpCircle,
	Layers,
	Rocket,
	Search,
	TrendingUp,
	User,
	X,
	type LucideIcon,
} from "lucide-react";
import { ApiError } from "../types/api";
import { onboardingApi } from "../services/onboarding";
import { masterApi } from "../services/master";
import { cvApi } from "../services/cv";
import IconTile from "../components/ui/IconTile";
import Card from "../components/ui/Card";
import { PageTransition } from "../components/ui/Motion";
import { capitalizeName, firstName } from "../lib/format";
import type { Tone } from "../lib/modules";
import type { CareerGoal, OnboardingPayload } from "../types/onboarding";

function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface FormData {
	fullName: string;
	role: string;
	industry: string;
	experience: string;
	isFirstJob: string;
	dailyActivities: string;
	skills: string[];
	careerGoal: string;
	targetRole: string;
	targetIndustry: string;
}

const STEP_META: Record<
	number,
	{ icon: LucideIcon; tone: Tone; badge: string }
> = {
	1: {
		icon: User,
		tone: "indigo",
		badge: "Langkah 1 · Perkenalan",
	},
	2: {
		icon: Briefcase,
		tone: "indigo",
		badge: "Langkah 2 · Peran Saat Ini",
	},
	3: {
		icon: Building2,
		tone: "indigo",
		badge: "Langkah 3 · Industri",
	},
	4: {
		icon: Clock,
		tone: "indigo",
		badge: "Langkah 4 · Jam Terbang",
	},
	5: {
		icon: Layers,
		tone: "indigo",
		badge: "Langkah 5 · Rutinitas Kerja",
	},
	6: {
		icon: Award,
		tone: "indigo",
		badge: "Langkah 6 · Keahlian Utama",
	},
	7: {
		icon: Compass,
		tone: "indigo",
		badge: "Langkah 7 · Arah Karier",
	},
	8: {
		icon: FileText,
		tone: "indigo",
		badge: "Langkah 8 · Dokumen CV",
	},
	9: {
		icon: Rocket,
		tone: "safe",
		badge: "Selesai · Siap Meluncur",
	},
};

const experienceCards: {
	label: string;
	sub: string;
	icon: LucideIcon;
	tone: Tone;
}[] = [
	{
		label: "Belum 1 tahun",
		sub: "Baru memulai perjalanan profesional",
		icon: Award,
		tone: "indigo",
	},
	{
		label: "1–3 tahun",
		sub: "Sedang membangun fondasi keahlian",
		icon: TrendingUp,
		tone: "indigo",
	},
	{
		label: "3–5 tahun",
		sub: "Mandiri & mulai memegang tanggung jawab",
		icon: Briefcase,
		tone: "indigo",
	},
	{
		label: "5–10 tahun",
		sub: "Berpengalaman & matang secara teknis",
		icon: Compass,
		tone: "indigo",
	},
	{
		label: "Lebih dari 10 tahun",
		sub: "Senior dengan jam terbang tinggi",
		icon: Rocket,
		tone: "indigo",
	},
];

const careerGoalOptions: {
	title: string;
	desc: string;
	icon: LucideIcon;
	tone: Tone;
}[] = [
	{
		title: "Tetap berkembang",
		desc: "Tetap di role sekarang dan memperdalam keahlian.",
		icon: TrendingUp,
		tone: "indigo",
	},
	{
		title: "Naik level",
		desc: "Mengejar promosi atau tanggung jawab lebih besar.",
		icon: Rocket,
		tone: "indigo",
	},
	{
		title: "Pindah role",
		desc: "Berpindah ke fungsi atau profesi yang berbeda.",
		icon: GitFork,
		tone: "indigo",
	},
	{
		title: "Pindah industri",
		desc: "Membawa keahlianmu ke sektor industri baru.",
		icon: Building2,
		tone: "indigo",
	},
	{
		title: "Belum tahu",
		desc: "Ingin melihat rekomendasi jalur yang paling cocok.",
		icon: HelpCircle,
		tone: "indigo",
	},
];

export default function Onboarding() {
	const navigate = useNavigate();
	const [step, setStep] = useState<number>(1);
	const [industryDropdownOpen, setIndustryDropdownOpen] =
		useState<boolean>(false);
	const [industrySearch, setIndustrySearch] = useState<string>("");
	const [skillInput, setSkillInput] = useState<string>("");
	const [skillFilter, setSkillFilter] = useState<string>("");
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [masterIndustries, setMasterIndustries] = useState<string[]>([]);
	const [masterSkillSuggestions, setMasterSkillSuggestions] = useState<
		string[]
	>([]);

	const [cvFile, setCvFile] = useState<File | null>(null);

	const [formData, setFormData] = useState<FormData>({
		fullName: "",
		role: "",
		industry: "",
		experience: "",
		isFirstJob: "",
		dailyActivities: "",
		skills: [],
		careerGoal: "",
		targetRole: "",
		targetIndustry: "",
	});

	const industries = [
		"Technology",
		"Finance",
		"Marketing",
		"Sales",
		"Design & Creative",
		"Human Resources",
	];

	const skillSuggestions = [
		"Problem Solving",
		"Communication",
		"Programming",
		"System Design",
		"Debugging",
		"Project Management",
		"Data Analysis",
		"Product Strategy",
	];

	const handleAddSkill = (skill: string) => {
		if (
			skill &&
			!formData.skills.includes(skill) &&
			formData.skills.length < 8
		) {
			setFormData({ ...formData, skills: [...formData.skills, skill] });
			setSkillInput("");
			setErrorMessage("");
		}
	};

	const handleRemoveSkill = (skillToRemove: string) => {
		setFormData({
			...formData,
			skills: formData.skills.filter((s) => s !== skillToRemove),
		});
	};

	const isStepValid = (): boolean => {
		switch (step) {
			case 1:
				return formData.fullName.trim() !== "";
			case 2:
				return formData.role.trim() !== "";
			case 3:
				return formData.industry.trim() !== "";
			case 4:
				return formData.experience !== "" && formData.isFirstJob !== "";
			case 5:
				return formData.dailyActivities.trim() !== "";
			case 6:
				return formData.skills.length > 0;
			case 7:
				return formData.careerGoal !== "";
			case 8:
				return true;
			default:
				return true;
		}
	};

	const handleNext = () => {
		if (!isStepValid()) {
			setErrorMessage(
				"Yuk, lengkapi bagian ini dulu supaya kami bisa memetakan profilmu dengan tepat.",
			);
			return;
		}
		setErrorMessage("");
		setStep((prev) => prev + 1);
	};

	const handleBack = () => {
		setErrorMessage("");
		setStep((prev) => prev - 1);
	};

	const experienceToMonths = (exp: string): number => {
		switch (exp) {
			case "Belum 1 tahun":
				return 6;
			case "1–3 tahun":
				return 24;
			case "3–5 tahun":
				return 48;
			case "5–10 tahun":
				return 90;
			case "Lebih dari 10 tahun":
				return 144;
			default:
				return 0;
		}
	};

	const careerGoalToEnum = (title: string): CareerGoal => {
		switch (title) {
			case "Tetap berkembang":
				return "grow_current";
			case "Naik level":
				return "level_up";
			case "Pindah role":
				return "change_role";
			case "Pindah industri":
				return "change_industry";
			case "Belum tahu":
				return "undecided";
			default:
				return "undecided";
		}
	};

	const handleFinish = async () => {
		setIsSubmitting(true);
		setErrorMessage("");
		try {
			const payload: OnboardingPayload = {
				full_name: capitalizeName(formData.fullName),
				current_role_name: formData.role,
				industry_name: formData.industry,
				work_duration_months: experienceToMonths(formData.experience),
				is_first_job: formData.isFirstJob === "Ya",
				daily_activities: formData.dailyActivities,
				career_goal: careerGoalToEnum(formData.careerGoal),
				target_role_name: formData.targetRole.trim() || null,
				target_industry_name: formData.targetIndustry.trim() || null,
				skills: formData.skills,
			};
			await onboardingApi.complete(payload);
			localStorage.setItem("jalurB_onboarding", JSON.stringify(formData));
			if (cvFile) {
				try {
					const preview = await cvApi.preview(cvFile);
					await cvApi.confirm({
						preview_token: preview.preview_token,
						profile: preview.profile,
						skills: preview.skills,
						experiences: preview.experiences,
					});
				} catch {
					// CV bersifat opsional — kegagalan baca CV tidak menghalangi onboarding.
				}
			}
			navigate("/dashboard");
		} catch (err) {
			setErrorMessage(
				err instanceof ApiError
					? err.message
					: "Gagal menyimpan profil. Silakan coba lagi.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	useEffect(() => {
		let active = true;
		(async () => {
			try {
				const [opts, skillsRes] = await Promise.all([
					onboardingApi.options(),
					masterApi.skills({ limit: 40 }).catch(() => null),
				]);
				if (!active) return;
				if (opts?.industries?.length) {
					setMasterIndustries(opts.industries);
				}
				const skillNames =
					skillsRes?.items?.map((s) => s.name).filter(Boolean) ?? [];
				if (skillNames.length) {
					setMasterSkillSuggestions(skillNames);
				} else if (opts?.skills?.length) {
					setMasterSkillSuggestions(opts.skills.map((s) => s.name));
				}
			} catch {
				// biarkan daftar bawaan sebagai fallback
			}
		})();
		return () => {
			active = false;
		};
	}, []);

	const industrySource = masterIndustries.length
		? masterIndustries
		: industries;
	const skillSource = masterSkillSuggestions.length
		? masterSkillSuggestions
		: skillSuggestions;

	const filteredIndustries = industrySource.filter((i) =>
		i.toLowerCase().includes(industrySearch.toLowerCase()),
	);

	// Saran skill dibatasi tampilannya (maks 10 chip) dan diberi pencarian
	const visibleSkillSuggestions = skillSource
		.filter(
			(s) =>
				!formData.skills.includes(s) &&
				s.toLowerCase().includes(skillFilter.trim().toLowerCase()),
		)
		.slice(0, 10);

	const userFirst = firstName(formData.fullName);
	const meta = STEP_META[step] ?? STEP_META[1];

	return (
		<div className="min-h-screen bg-app text-slate-900 flex flex-col items-center p-4 sm:p-8 font-sans">
			<div className="w-full max-w-2xl mb-6 space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2.5">
						<img
							className="w-9 h-9 rounded-xl shadow-xs border border-slate-200"
							src="/icon.png"
							alt="Logo Jalur B"
						/>
						<div>
							<span className="font-bold text-slate-900 text-base block leading-none">
								Jalur B
							</span>
							<span className="text-xs text-slate-500 font-medium mt-0.5 block">
								Persiapan Profil Karier
							</span>
						</div>
					</div>
					<span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-indigo-700 tabular">
						{step > 8 ? "Selesai" : `Langkah ${step} dari 8`}
					</span>
				</div>

				<div
					role="progressbar"
					aria-valuemin={1}
					aria-valuemax={8}
					aria-valuenow={Math.min(8, step)}
					className="grid grid-cols-8 gap-1.5">
					{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
						const active = i <= step;
						return (
							<div
								key={i}
								className={`h-2 rounded-full transition-colors duration-300 ${
									active ? "bg-indigo-600" : "bg-slate-200"
								}`}
							/>
						);
					})}
				</div>
			</div>

			<Card padding="lg" className="w-full max-w-2xl">
				<PageTransition routeKey={String(step)}>
					<div className="flex items-center gap-3.5 mb-5">
						<IconTile icon={meta.icon} tone={meta.tone} size="lg" />
						<div>
							<span className="text-xs font-semibold text-indigo-700">
								{meta.badge}
							</span>
							{userFirst && step > 1 && step < 9 && (
								<p className="text-xs font-medium text-slate-500 mt-0.5">
									Halo {userFirst}, sedikit lagi profilmu lengkap.
								</p>
							)}
						</div>
					</div>

					{step === 1 && (
						<div>
							<h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
								Halo, kenalan dulu
							</h1>
							<p className="text-sm sm:text-[15px] text-slate-600 mt-1.5">
								Siapa nama lengkapmu? Kami akan menyapamu dengan nama ini di
								seluruh ruang kerja Jalur B.
							</p>

							<div className="mt-7">
								<label className="block text-xs font-semibold text-slate-600 mb-2">
									Nama Lengkap
								</label>
								<input
									type="text"
									autoFocus
									placeholder="Contoh: Joan Orlando Purba"
									value={formData.fullName}
									onChange={(e) => {
										setFormData({ ...formData, fullName: e.target.value });
										if (errorMessage) setErrorMessage("");
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter" && isStepValid()) {
											e.preventDefault();
											handleNext();
										}
									}}
									className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/20 text-base font-medium text-slate-900 placeholder:text-slate-400"
								/>
								<p className="text-xs text-slate-500 mt-2">
									Tenang, namamu hanya tampil untuk mempersonalisasi pengalamanmu.
								</p>
							</div>
						</div>
					)}

					{step === 2 && (
						<div>
							<h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
								Senang bertemu denganmu, {userFirst || "Teman"}. Saat ini kamu
								bekerja sebagai apa?
							</h1>
							<p className="text-sm sm:text-[15px] text-slate-600 mt-1.5">
								Tulis jabatan atau peran utamamu sehari-hari.
							</p>

							<div className="mt-7">
								<label className="block text-xs font-semibold text-slate-600 mb-2">
									Role / Jabatan Saat Ini
								</label>
								<input
									type="text"
									autoFocus
									placeholder="Contoh: Software Engineer, Product Manager, Finance Analyst"
									value={formData.role}
									onChange={(e) => {
										setFormData({ ...formData, role: e.target.value });
										if (errorMessage) setErrorMessage("");
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter" && isStepValid()) {
											e.preventDefault();
											handleNext();
										}
									}}
									className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/20 text-base font-medium text-slate-900 placeholder:text-slate-400"
								/>
							</div>
						</div>
					)}

					{step === 3 && (
						<div>
							<h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
								Di industri apa kamu berkarya sekarang, {userFirst || "Teman"}?
							</h1>
							<p className="text-sm sm:text-[15px] text-slate-600 mt-1.5">
								Tiap industri punya dinamika pasar dan adopsi AI yang berbeda.
							</p>

							<div className="mt-6">
								<label className="block text-xs font-semibold text-slate-600 mb-2">
									Pilih Bidang / Industri
								</label>
								<div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-3">
									{industrySource.slice(0, 6).map((item) => {
										const selected = formData.industry === item;
										return (
											<button
												key={item}
												type="button"
												onClick={() => {
													setFormData({ ...formData, industry: item });
													setIndustryDropdownOpen(false);
													if (errorMessage) setErrorMessage("");
												}}
												className={`min-h-[44px] p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center justify-between gap-2 ${
													selected
														? "border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-500/25"
														: "border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
												}`}>
												<span className="truncate">{item}</span>
												{selected && (
													<Check size={14} className="text-indigo-600 shrink-0" />
												)}
											</button>
										);
									})}
								</div>

								<div className="relative">
									<button
										type="button"
										onClick={() =>
											setIndustryDropdownOpen(!industryDropdownOpen)
										}
										className="w-full min-h-[44px] px-4 py-3 rounded-xl border border-slate-200 bg-white text-left flex justify-between items-center text-sm font-medium text-slate-900 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/20">
										<span
											className={
												formData.industry ? "text-slate-900" : "text-slate-400"
											}>
											{formData.industry || "Atau cari industri lainnya..."}
										</span>
										<Search size={15} className="text-slate-400" />
									</button>

									{industryDropdownOpen && (
										<div className="mt-2 bg-white rounded-xl border border-slate-200 shadow-lg z-20 p-2">
											<div className="flex items-center px-3 py-2 border-b border-slate-100 mb-1">
												<Search size={14} className="text-slate-400 mr-2" />
												<input
													type="text"
													placeholder="Ketik nama industri..."
													value={industrySearch}
													onChange={(e) => setIndustrySearch(e.target.value)}
													className="w-full text-sm outline-none bg-transparent placeholder:text-slate-400 text-slate-900"
												/>
											</div>
											<div className="max-h-48 overflow-y-auto">
												{filteredIndustries.map((item) => (
													<button
														key={item}
														type="button"
														onClick={() => {
															setFormData({ ...formData, industry: item });
															setIndustryDropdownOpen(false);
															if (errorMessage) setErrorMessage("");
														}}
														className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition ${
															formData.industry === item
																? "bg-indigo-50 text-indigo-800 font-semibold"
																: "hover:bg-slate-50 text-slate-800"
														}`}>
														{item}
													</button>
												))}
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					)}

					{step === 4 && (
						<div>
							<h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
								Sudah berapa lama kamu menjalani peran ini?
							</h1>
							<p className="text-sm sm:text-[15px] text-slate-600 mt-1.5">
								Masa kerja membantu kami memperkirakan kematangan peran dan hak
								normatifmu.
							</p>

							<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
								{experienceCards.map((opt) => {
									const selected = formData.experience === opt.label;
									return (
										<button
											key={opt.label}
											type="button"
											onClick={() => {
												setFormData({ ...formData, experience: opt.label });
												if (errorMessage) setErrorMessage("");
											}}
											className={`p-4 rounded-xl border text-left flex items-center gap-3.5 transition cursor-pointer ${
												selected
													? "border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-500/25"
													: "border-slate-200 bg-white hover:border-indigo-200"
											}`}>
											<IconTile icon={opt.icon} tone={opt.tone} size="sm" />
											<div className="min-w-0 flex-1">
												<p className="text-sm font-bold text-slate-900">
													{opt.label}
												</p>
												<p className="text-xs text-slate-500 mt-0.5">
													{opt.sub}
												</p>
											</div>
											{selected && (
												<span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
													<Check size={12} strokeWidth={3} />
												</span>
											)}
										</button>
									);
								})}
							</div>

							<div className="mt-6 pt-5 border-t border-slate-100">
								<label className="block text-xs font-semibold text-slate-600 mb-2.5">
									Apakah ini pekerjaan pertamamu?
								</label>
								<div className="grid grid-cols-2 gap-3">
									{[
										{ id: "Ya", desc: "Ya, pekerjaan pertamaku" },
										{ id: "Tidak", desc: "Bukan, sudah pernah pindah" },
									].map((opt) => {
										const selected = formData.isFirstJob === opt.id;
										return (
											<button
												key={opt.id}
												type="button"
												onClick={() => {
													setFormData({ ...formData, isFirstJob: opt.id });
													if (errorMessage) setErrorMessage("");
												}}
												className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
													selected
														? "border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-500/25 text-slate-900"
														: "border-slate-200 bg-white hover:border-indigo-200 text-slate-900"
												}`}>
												<div>
													<span className="text-sm font-bold block">
														{opt.id}
													</span>
													<span className="text-xs text-slate-500">
														{opt.desc}
													</span>
												</div>
												{selected && (
													<span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
														<Check size={12} strokeWidth={3} />
													</span>
												)}
											</button>
										);
									})}
								</div>
							</div>
						</div>
					)}

					{step === 5 && (
						<div>
							<h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
								Sehari-hari kamu mengerjakan apa saja, {userFirst || "Teman"}?
							</h1>
							<p className="text-sm sm:text-[15px] text-slate-600 mt-1.5">
								Ceritakan santai dengan bahasa sehari-hari—tidak perlu bahasa CV
								yang kaku.
							</p>

							<div className="mt-6">
								<label className="block text-xs font-semibold text-slate-600 mb-2">
									Aktivitas Harian Utama
								</label>
								<textarea
									rows={4}
									value={formData.dailyActivities}
									onChange={(e) => {
										setFormData({
											...formData,
											dailyActivities: e.target.value,
										});
										if (errorMessage) setErrorMessage("");
									}}
									placeholder="Contoh: Aku mengurus pengembangan fitur aplikasi, code review, berdiskusi dengan tim produk, dan memperbaiki bug produksi."
									className="w-full p-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/20 text-sm text-slate-900 resize-none placeholder:text-slate-400 leading-relaxed"
								/>
								<p className="text-xs text-slate-500 mt-2">
									Dari cerita singkat ini, Jalur B akan memetakan aktivitas mana
									yang bisa dibantu AI dan mana yang menjadi keahlian unikmu.
								</p>
							</div>
						</div>
					)}

					{step === 6 && (
						<div>
							<h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
								Skill apa yang paling menjadi andalanmu?
							</h1>
							<p className="text-sm sm:text-[15px] text-slate-600 mt-1.5">
								Pilih atau ketik 1 hingga 8 keahlian yang paling menggambarkan
								nilai jualmu ({formData.skills.length}/8 terpilih).
							</p>

							<div className="mt-6 space-y-4">
								<div className="min-h-[84px] p-3.5 rounded-xl border border-slate-200 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 flex flex-wrap gap-2 items-center transition">
									{formData.skills.map((skill) => (
										<span
											key={skill}
											className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-semibold">
											{skill}
											<button
												type="button"
												onClick={() => handleRemoveSkill(skill)}
												aria-label={`Hapus ${skill}`}
												className="hover:text-rose-700 cursor-pointer">
												<X size={13} />
											</button>
										</span>
									))}
									<input
										type="text"
										value={skillInput}
										onChange={(e) => setSkillInput(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleAddSkill(skillInput.trim());
											}
										}}
										placeholder={
											formData.skills.length === 0
												? "Ketik skill lalu tekan Enter..."
												: "Tambah skill lain lalu Enter..."
										}
										className="flex-1 min-w-[160px] outline-none text-sm p-1 font-medium text-slate-900 placeholder:text-slate-400"
									/>
								</div>

								<div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
									<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
										<span className="text-xs font-semibold text-slate-600">
											Rekomendasi Populer (klik untuk menambah)
										</span>
										<div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5">
											<Search size={13} className="text-slate-400" />
											<input
												type="text"
												value={skillFilter}
												onChange={(e) => setSkillFilter(e.target.value)}
												placeholder="Cari saran skill..."
												className="text-xs outline-none bg-transparent w-36 text-slate-900 placeholder:text-slate-400"
											/>
										</div>
									</div>

									<div className="flex flex-wrap gap-2">
										{visibleSkillSuggestions.length > 0 ? (
											visibleSkillSuggestions.map((sug) => (
												<button
													key={sug}
													type="button"
													onClick={() => handleAddSkill(sug)}
													className="min-h-[36px] px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 transition cursor-pointer">
													+ {sug}
												</button>
											))
										) : (
											<p className="text-xs text-slate-500">
												Ketik skill di kotak atas lalu tekan Enter untuk
												menambahkan manual.
											</p>
										)}
									</div>
								</div>
							</div>
						</div>
					)}

					{step === 7 && (
						<div>
							<h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
								Ke mana kamu ingin membawa kariermu 1–2 tahun ke depan,{" "}
								{userFirst || "Teman"}?
							</h1>
							<p className="text-sm sm:text-[15px] text-slate-600 mt-1.5">
								Pilih arah yang paling sesuai dengan kondisimu saat ini.
							</p>

							<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
								{careerGoalOptions.map((opt) => {
									const selected = formData.careerGoal === opt.title;
									return (
										<button
											key={opt.title}
											type="button"
											onClick={() => {
												setFormData({ ...formData, careerGoal: opt.title });
												if (errorMessage) setErrorMessage("");
											}}
											className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition cursor-pointer ${
												selected
													? "border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-500/25"
													: "border-slate-200 bg-white hover:border-indigo-200"
											}`}>
											<IconTile icon={opt.icon} tone={opt.tone} size="sm" />
											<div className="flex-1 min-w-0">
												<p className="text-sm font-bold text-slate-900">
													{opt.title}
												</p>
												<p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
													{opt.desc}
												</p>
											</div>
											{selected && (
												<span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
													<Check size={12} strokeWidth={3} />
												</span>
											)}
										</button>
									);
								})}
							</div>

							<div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="block text-xs font-semibold text-slate-600 mb-1.5">
										Role yang kamu incar (opsional)
									</label>
									<input
										type="text"
										value={formData.targetRole}
										onChange={(e) =>
											setFormData({ ...formData, targetRole: e.target.value })
										}
										placeholder="Contoh: Tech Lead, Product Manager"
										className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus-visible:border-indigo-500 text-sm text-slate-900 placeholder:text-slate-400"
									/>
								</div>

								<div>
									<label className="block text-xs font-semibold text-slate-600 mb-1.5">
										Industri incaran (opsional)
									</label>
									<input
										type="text"
										value={formData.targetIndustry}
										onChange={(e) =>
											setFormData({
												...formData,
												targetIndustry: e.target.value,
											})
										}
										placeholder="Contoh: FinTech, EduTech"
										className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus-visible:border-indigo-500 text-sm text-slate-900 placeholder:text-slate-400"
									/>
								</div>
							</div>
						</div>
					)}

					{step === 8 && (
						<div>
							<h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
								Ingin melampirkan CV sekalian? (Opsional)
							</h1>
							<p className="text-sm sm:text-[15px] text-slate-600 mt-1.5">
								CV membantu Jalur B mengekstrak riwayat pengalaman kerjamu secara
								otomatis. Kamu juga bebas melewati langkah ini dan mengunggahnya
								nanti di halaman Profil.
							</p>

							<div className="mt-7">
								{cvFile ? (
									<div className="flex items-center gap-4 p-4 rounded-xl border border-indigo-200 bg-indigo-50/50">
										<IconTile icon={FileText} tone="indigo" size="md" />
										<div className="flex-1 min-w-0">
											<p className="text-sm font-bold text-slate-900 truncate">
												{cvFile.name}
											</p>
											<p className="text-xs text-slate-600">
												{formatFileSize(cvFile.size)} · Siap diproses
											</p>
										</div>
										<button
											type="button"
											onClick={() => setCvFile(null)}
											className="text-xs font-semibold text-rose-700 hover:underline cursor-pointer">
											Hapus
										</button>
									</div>
								) : (
									<div>
										<input
											id="cv-upload"
											type="file"
											accept=".pdf,.doc,.docx"
											onChange={(e) => {
												const file = e.target.files?.[0] ?? null;
												setCvFile(file);
												if (errorMessage) setErrorMessage("");
											}}
											className="sr-only"
										/>
										<label
											htmlFor="cv-upload"
											className="flex flex-col items-center justify-center w-full p-8 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 hover:border-indigo-400 hover:bg-indigo-50/40 transition cursor-pointer text-center">
											<IconTile
												icon={FileText}
												tone="indigo"
												size="md"
												className="mb-3"
											/>
											<p className="text-sm font-bold text-slate-900">
												Klik untuk memilih berkas CV
											</p>
											<p className="text-xs text-slate-500 mt-1">
												Format PDF, DOC, atau DOCX — maksimal 5 MB
											</p>
										</label>
									</div>
								)}
							</div>
						</div>
					)}

					{step === 9 && (
						<div>
							<h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
								Profil kariermu sudah siap, {userFirst || "Teman"}.
							</h1>
							<p className="text-sm sm:text-[15px] text-slate-600 mt-1.5">
								Ini ringkasan profil awal yang akan digunakan Jalur B untuk
								memetakan ketahanan karier dan finansialmu.
							</p>

							<div className="mt-6 p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
								<div className="flex items-center justify-between gap-3">
									<div>
										<h3 className="text-lg font-bold text-slate-900">
											{capitalizeName(formData.fullName) || "Belum diisi"}
										</h3>
										<p className="text-xs font-medium text-indigo-700 mt-0.5">
											{formData.role || "Belum diisi"} ·{" "}
											{formData.industry || "Belum diisi"} ·{" "}
											{formData.experience || "-"}
										</p>
									</div>
									<span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
										Siap Dianalisis
									</span>
								</div>

								<div>
									<span className="text-xs font-semibold text-slate-500 block mb-2">
										Keahlian Utama ({formData.skills.length})
									</span>
									<div className="flex flex-wrap gap-2">
										{formData.skills.map((s) => (
											<span
												key={s}
												className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-medium">
												{s}
											</span>
										))}
									</div>
								</div>

								<div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-3 text-xs">
									<div>
										<span className="text-slate-500 block">
											Pekerjaan pertama
										</span>
										<span className="font-semibold text-slate-900">
											{formData.isFirstJob || "—"}
										</span>
									</div>
									<div>
										<span className="text-slate-500 block">Arah karier</span>
										<span className="font-semibold text-slate-900">
											{formData.careerGoal || "—"}
										</span>
									</div>
									<div>
										<span className="text-slate-500 block">Role incaran</span>
										<span className="font-semibold text-slate-900">
											{formData.targetRole || "Otomatis"}
										</span>
									</div>
									<div>
										<span className="text-slate-500 block">
											Industri incaran
										</span>
										<span className="font-semibold text-slate-900">
											{formData.targetIndustry || "Otomatis"}
										</span>
									</div>
								</div>
							</div>
						</div>
					)}
				</PageTransition>

				{errorMessage && (
					<p className="text-xs text-rose-700 font-semibold mt-4">
						{errorMessage}
					</p>
				)}

				<div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
					{step > 1 ? (
						<button
							type="button"
							onClick={handleBack}
							className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer">
							<ArrowLeft size={15} />
							Kembali
						</button>
					) : (
						<div />
					)}

					{step < 9 ? (
						<button
							type="button"
							onClick={handleNext}
							disabled={!isStepValid()}
							className={`min-h-[44px] px-6 py-2.5 text-sm font-semibold rounded-xl transition inline-flex items-center gap-2 ${
								isStepValid()
									? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs cursor-pointer"
									: "bg-slate-200 text-slate-400 cursor-not-allowed"
							}`}>
							<span>{step === 8 && !cvFile ? "Lewati & Lanjut" : "Lanjut"}</span>
							<ArrowRight size={15} />
						</button>
					) : (
						<button
							type="button"
							onClick={() => void handleFinish()}
							disabled={isSubmitting}
							className={`min-h-[44px] px-6 py-2.5 text-white text-sm font-semibold rounded-xl transition inline-flex items-center gap-2 ${
								isSubmitting
									? "bg-indigo-400 cursor-not-allowed"
									: "bg-indigo-600 hover:bg-indigo-700 shadow-xs cursor-pointer"
							}`}>
							<span>
								{isSubmitting ? "Menyimpan Profil..." : "Masuk ke Dashboard"}
							</span>
							{!isSubmitting && <ArrowRight size={16} />}
						</button>
					)}
				</div>
			</Card>
		</div>
	);
}
