import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface FormData {
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

export default function Onboarding() {
	const navigate = useNavigate();
	const [step, setStep] = useState<number>(1);
	const [industryDropdownOpen, setIndustryDropdownOpen] =
		useState<boolean>(false);
	const [industrySearch, setIndustrySearch] = useState<string>("");
	const [skillInput, setSkillInput] = useState<string>("");
	const [errorMessage, setErrorMessage] = useState<string>("");

	const [formData, setFormData] = useState<FormData>({
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

	const experienceOptions = [
		"Belum 1 tahun",
		"1–3 tahun",
		"3–5 tahun",
		"5–10 tahun",
		"Lebih dari 10 tahun",
	];

	const skillSuggestions = [
		"Problem Solving",
		"Communication",
		"Programming",
		"System Design",
		"Debugging",
	];

	const careerGoalOptions = [
		{
			title: "Tetap berkembang",
			desc: "Tetap di role sekarang dan meningkatkan kemampuan.",
		},
		{
			title: "Naik level",
			desc: "Mengejar posisi atau tanggung jawab yang lebih tinggi.",
		},
		{ title: "Pindah role", desc: "Mencoba pekerjaan yang berbeda." },
		{ title: "Pindah industri", desc: "Membawa skill ke industri baru." },
		{ title: "Belum tahu", desc: "Masih ingin mencari tahu pilihan yang cocok." },
	];

	const handleAddSkill = (skill: string) => {
		if (skill && !formData.skills.includes(skill) && formData.skills.length < 8) {
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
				return formData.role.trim() !== "";
			case 2:
				return formData.industry.trim() !== "";
			case 3:
				return formData.experience !== "" && formData.isFirstJob !== "";
			case 4:
				return formData.dailyActivities.trim() !== "";
			case 5:
				return formData.skills.length > 0;
			case 6:
				return formData.careerGoal !== "";
			default:
				return true;
		}
	};

	const handleNext = () => {
		if (!isStepValid()) {
			setErrorMessage("Harap isi bidang ini terlebih dahulu sebelum melanjutkan.");
			return;
		}
		setErrorMessage("");
		setStep((prev) => prev + 1);
	};

	const handleBack = () => {
		setErrorMessage("");
		setStep((prev) => prev - 1);
	};

	const filteredIndustries = industries.filter((i) =>
		i.toLowerCase().includes(industrySearch.toLowerCase()),
	);

	return (
		<div className="min-h-screen bg-[#F9F9FB] text-neutral flex flex-col items-center p-4 sm:p-6 font-sans">
			<div className="w-full max-w-2xl flex items-center justify-between mb-8">
				<div className="flex items-center gap-2">
					<img className="w-10 h-10 rounded-full" src="/icon.png" alt="" />
					<span className="font-semibold text-neutral">Jalur B</span>
				</div>
				<div className="flex items-center gap-4">
					<div className="flex gap-1.5">
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<div
								key={i}
								className={`h-1.5 rounded-full transition-all duration-300 ${
									i <= step ? "w-8 bg-primary" : "w-6 bg-neutral/10"
								}`}
							/>
						))}
					</div>
					<span className="text-xs text-neutral/50 font-medium">
						{step > 6 ? "6 dari 6" : `${step} dari 6`}
					</span>
				</div>
			</div>

			<div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-neutral/5">
				{step === 1 && (
					<div>
						<span className="text-xs font-bold text-primary tracking-wider uppercase">
							Langkah 1
						</span>
						<h1 className="text-2xl sm:text-3xl font-bold mt-2 text-neutral">
							Kenalan dulu dengan kariermu.
						</h1>
						<p className="text-sm text-neutral/60 mt-1">
							Saat ini kamu bekerja sebagai apa?
						</p>

						<div className="mt-8">
							<label className="block text-xs font-semibold text-neutral mb-2">
								Role / Jabatan
							</label>
							<input
								type="text"
								placeholder="Contoh: Software Engineer, Product Manager"
								value={formData.role}
								onChange={(e) => {
									setFormData({ ...formData, role: e.target.value });
									if (errorMessage) setErrorMessage("");
								}}
								className="w-full px-4 py-3 rounded-2xl border border-neutral/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-neutral placeholder:text-neutral/40"
							/>
							<p className="text-xs text-neutral/50 mt-2">
								Role kamu membantu Jalur B memahami konteks pekerjaanmu.
							</p>
						</div>
					</div>
				)}

				{step === 2 && (
					<div>
						<span className="text-xs font-bold text-primary tracking-wider uppercase">
							Langkah 2
						</span>
						<h1 className="text-2xl sm:text-3xl font-bold mt-2 text-neutral">
							Kamu bekerja di bidang apa?
						</h1>
						<p className="text-sm text-neutral/60 mt-1">
							Pilih bidang yang paling mendekati pekerjaanmu.
						</p>

						<div className="mt-8 relative">
							<label className="block text-xs font-semibold text-neutral mb-2">
								Bidang / Industri
							</label>
							<button
								type="button"
								onClick={() => setIndustryDropdownOpen(!industryDropdownOpen)}
								className="w-full px-4 py-3 rounded-2xl border border-neutral/20 text-left flex justify-between items-center text-neutral focus:outline-none focus:border-primary">
								<span
									className={formData.industry ? "text-neutral" : "text-neutral/40"}>
									{formData.industry || "Pilih bidang..."}
								</span>
								<svg
									className={`w-4 h-4 text-neutral/60 transition-transform ${
										industryDropdownOpen ? "rotate-180" : ""
									}`}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>

							{industryDropdownOpen && (
								<div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-neutral/10 shadow-lg z-20 p-2">
									<div className="flex items-center px-3 py-2 border-b border-neutral/10 mb-1">
										<svg
											className="w-4 h-4 text-neutral/40 mr-2"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
											/>
										</svg>
										<input
											type="text"
											placeholder="Cari bidang..."
											value={industrySearch}
											onChange={(e) => setIndustrySearch(e.target.value)}
											className="w-full text-sm outline-none bg-transparent placeholder:text-neutral/40"
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
												className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition ${
													formData.industry === item
														? "bg-primary/10 text-primary font-medium"
														: "hover:bg-tertiary text-neutral"
												}`}>
												{item}
											</button>
										))}
									</div>
								</div>
							)}
							<p className="text-xs text-neutral/50 mt-2">
								Bidang ini membantu Jalur B memahami perubahan yang terjadi di dunia
								kerjamu.
							</p>
						</div>
					</div>
				)}

				{step === 3 && (
					<div>
						<span className="text-xs font-bold text-primary tracking-wider uppercase">
							Langkah 3
						</span>
						<h1 className="text-2xl sm:text-3xl font-bold mt-2 text-neutral">
							Seberapa lama kamu sudah bekerja?
						</h1>
						<p className="text-sm text-neutral/60 mt-1">
							Pilih yang paling mendekati.
						</p>

						<div className="mt-6 space-y-3">
							{experienceOptions.map((opt) => {
								const selected = formData.experience === opt;
								return (
									<button
										key={opt}
										type="button"
										onClick={() => {
											setFormData({ ...formData, experience: opt });
											if (errorMessage) setErrorMessage("");
										}}
										className={`w-full p-4 rounded-2xl border text-left flex justify-between items-center transition ${
											selected
												? "border-primary bg-primary/5 font-medium text-neutral"
												: "border-neutral/15 hover:border-neutral/30 text-neutral"
										}`}>
										<span className="text-sm">{opt}</span>
										<div
											className={`w-5 h-5 rounded-full flex items-center justify-center border ${
												selected
													? "bg-primary border-primary text-white"
													: "border-neutral/30"
											}`}>
											{selected && (
												<svg
													className="w-3 h-3"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={3}
														d="M5 13l4 4L19 7"
													/>
												</svg>
											)}
										</div>
									</button>
								);
							})}
						</div>

						<div className="mt-6">
							<label className="block text-xs font-semibold text-neutral mb-2">
								Apakah pekerjaan ini adalah pekerjaan pertamamu?
							</label>
							<div className="grid grid-cols-2 gap-3">
								{["Ya", "Tidak"].map((opt) => {
									const selected = formData.isFirstJob === opt;
									return (
										<button
											key={opt}
											type="button"
											onClick={() => {
												setFormData({ ...formData, isFirstJob: opt });
												if (errorMessage) setErrorMessage("");
											}}
											className={`p-3.5 rounded-2xl border flex justify-between items-center transition ${
												selected
													? "border-primary bg-primary/5 font-medium text-neutral"
													: "border-neutral/15 hover:border-neutral/30 text-neutral"
											}`}>
											<span className="text-sm">{opt}</span>
											<div
												className={`w-4 h-4 rounded-full flex items-center justify-center border ${
													selected
														? "bg-primary border-primary text-white"
														: "border-neutral/30"
												}`}>
												{selected && (
													<svg
														className="w-2.5 h-2.5"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24">
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={3}
															d="M5 13l4 4L19 7"
														/>
													</svg>
												)}
											</div>
										</button>
									);
								})}
							</div>
						</div>
					</div>
				)}

				{step === 4 && (
					<div>
						<span className="text-xs font-bold text-primary tracking-wider uppercase">
							Langkah 4
						</span>
						<h1 className="text-2xl sm:text-3xl font-bold mt-2 text-neutral">
							Sehari-hari kamu mengerjakan apa?
						</h1>
						<p className="text-sm text-neutral/60 mt-1">
							Ceritakan dengan bahasa sehari-hari. Nggak perlu formal.
						</p>

						<div className="mt-6">
							<label className="block text-xs font-semibold text-neutral mb-2">
								Aktivitas harianmu
							</label>
							<textarea
								rows={4}
								value={formData.dailyActivities}
								onChange={(e) => {
									setFormData({ ...formData, dailyActivities: e.target.value });
									if (errorMessage) setErrorMessage("");
								}}
								placeholder="Contoh: Aku mengurus campaign, riset pasar, membuat laporan, dan koordinasi dengan beberapa tim."
								className="w-full p-4 rounded-2xl border border-neutral/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm text-neutral resize-none placeholder:text-neutral/40"
							/>
							<p className="text-xs text-neutral/50 mt-2">
								Ceritakan aktivitas yang paling sering kamu lakukan. Jalur B akan
								membantu memahami pola pekerjaanmu.
							</p>
						</div>
					</div>
				)}

				{step === 5 && (
					<div>
						<span className="text-xs font-bold text-primary tracking-wider uppercase">
							Langkah 5
						</span>
						<h1 className="text-2xl sm:text-3xl font-bold mt-2 text-neutral">
							Apa yang paling kamu kuasai?
						</h1>
						<p className="text-sm text-neutral/60 mt-1">
							Pilih skill yang paling menggambarkan value-mu saat ini.
						</p>

						<div className="mt-6">
							<label className="block text-xs font-semibold text-neutral mb-2">
								Skill
							</label>
							<div className="min-h-[100px] p-3 rounded-2xl border border-neutral/20 focus-within:border-primary flex flex-wrap gap-2 items-start">
								{formData.skills.map((skill) => (
									<span
										key={skill}
										className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
										{skill}
										<button
											type="button"
											onClick={() => handleRemoveSkill(skill)}
											className="hover:opacity-70">
											<svg
												className="w-3.5 h-3.5"
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
											: "Tambah skill..."
									}
									className="flex-1 min-w-[140px] outline-none text-sm p-1 text-neutral placeholder:text-neutral/40"
								/>
							</div>

							<div className="flex items-center gap-2 mt-4 text-xs flex-wrap">
								<span className="text-neutral/50">Saran:</span>
								<div className="flex flex-wrap gap-2">
									{skillSuggestions.map((sug) => (
										<button
											key={sug}
											type="button"
											onClick={() => handleAddSkill(sug)}
											className="px-3 py-1 rounded-full border border-neutral/20 text-neutral hover:bg-tertiary transition">
											+ {sug}
										</button>
									))}
								</div>
							</div>
							<p className="text-xs text-neutral/50 mt-3">
								Pilih atau ketik minimal 1 skill. Maksimal 8 skill.
							</p>
						</div>
					</div>
				)}

				{step === 6 && (
					<div>
						<span className="text-xs font-bold text-primary tracking-wider uppercase">
							Langkah 6
						</span>
						<h1 className="text-2xl sm:text-3xl font-bold mt-2 text-neutral">
							Kamu ingin membawa kariermu ke mana?
						</h1>
						<p className="text-sm text-neutral/60 mt-1">
							Untuk 1–2 tahun ke depan, mana yang paling sesuai dengan rencanamu?
						</p>

						<div className="mt-6 space-y-3">
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
										className={`w-full p-4 rounded-2xl border text-left flex items-start justify-between transition ${
											selected
												? "border-primary bg-primary/5"
												: "border-neutral/15 hover:border-neutral/30"
										}`}>
										<div>
											<p
												className={`text-sm font-semibold ${selected ? "text-primary" : "text-neutral"}`}>
												{opt.title}
											</p>
											<p className="text-xs text-neutral/60 mt-0.5">{opt.desc}</p>
										</div>
										<div
											className={`w-5 h-5 rounded-full flex items-center justify-center border mt-0.5 ${
												selected
													? "bg-primary border-primary text-white"
													: "border-neutral/30"
											}`}>
											{selected && (
												<svg
													className="w-3 h-3"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={3}
														d="M5 13l4 4L19 7"
													/>
												</svg>
											)}
										</div>
									</button>
								);
							})}
						</div>

						<div className="mt-6 space-y-4">
							<div>
								<label className="block text-xs font-semibold text-neutral mb-1">
									Role yang kamu incar (opsional)
								</label>
								<input
									type="text"
									value={formData.targetRole}
									onChange={(e) =>
										setFormData({ ...formData, targetRole: e.target.value })
									}
									placeholder="Contoh: Tech Lead, Senior Marketing Specialist"
									className="w-full px-4 py-3 rounded-2xl border border-neutral/20 focus:outline-none focus:border-primary text-sm text-neutral placeholder:text-neutral/40"
								/>
							</div>

							<div>
								<label className="block text-xs font-semibold text-neutral mb-1">
									Industri yang kamu incar (opsional)
								</label>
								<input
									type="text"
									value={formData.targetIndustry}
									onChange={(e) =>
										setFormData({ ...formData, targetIndustry: e.target.value })
									}
									placeholder="Contoh: FinTech, E-Commerce"
									className="w-full px-4 py-3 rounded-2xl border border-neutral/20 focus:outline-none focus:border-primary text-sm text-neutral placeholder:text-neutral/40"
								/>
							</div>
							<p className="text-xs text-neutral/50">
								Belum punya target? Nggak apa-apa. Kamu bisa mengisinya nanti.
							</p>
						</div>
					</div>
				)}

				{step === 7 && (
					<div>
						<span className="text-xs font-bold text-primary tracking-wider uppercase">
							SELESAI
						</span>
						<h1 className="text-2xl sm:text-3xl font-bold mt-2 text-neutral">
							Profil kariermu sudah siap.
						</h1>
						<p className="text-sm text-neutral/60 mt-1">
							Ini gambaran awal yang kami dapat dari jawabanmu.
						</p>

						<div className="mt-6 p-6 rounded-2xl bg-tertiary/60 border border-neutral/10 space-y-4">
							<div>
								<h3 className="text-lg font-bold text-neutral capitalize">
									{formData.role || "Belum diisi"}
								</h3>
								<p className="text-xs text-neutral/60 mt-0.5">
									{formData.industry || "Belum diisi"} · {formData.experience || "-"}{" "}
									pengalaman
								</p>
							</div>

							<div>
								<span className="text-xs text-neutral/50 block mb-1.5">Skills</span>
								<div className="flex flex-wrap gap-2">
									{formData.skills.map((s) => (
										<span
											key={s}
											className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
											{s}
										</span>
									))}
								</div>
							</div>

							<div className="pt-2 border-t border-neutral/10 space-y-2 text-xs">
								<div className="flex justify-between py-1">
									<span className="text-neutral/50">Pekerjaan pertama</span>
									<span className="font-semibold text-neutral">
										{formData.isFirstJob || "-"}
									</span>
								</div>
								<div className="flex justify-between py-1 border-t border-neutral/5">
									<span className="text-neutral/50">Arah karier</span>
									<span className="font-semibold text-neutral">
										{formData.careerGoal || "-"}
									</span>
								</div>
								<div className="flex justify-between py-1 border-t border-neutral/5">
									<span className="text-neutral/50">Role incaran</span>
									<span className="font-semibold text-neutral">
										{formData.targetRole || "-"}
									</span>
								</div>
								<div className="flex justify-between py-1 border-t border-neutral/5">
									<span className="text-neutral/50">Industri incaran</span>
									<span className="font-semibold text-neutral">
										{formData.targetIndustry || "-"}
									</span>
								</div>
							</div>
						</div>

						<p className="text-xs text-neutral/50 mt-6 leading-relaxed">
							Jalur B akan menggunakan profil ini untuk membaca kesehatan karier,
							risiko pekerjaan, relevansi skill, dan peluang karier alternatifmu.
						</p>
					</div>
				)}

				{errorMessage && (
					<p className="text-xs text-red-500 font-medium mt-4">{errorMessage}</p>
				)}

				<div className="mt-8 pt-6 border-t border-neutral/10 flex items-center justify-between">
					{step > 1 ? (
						<button
							type="button"
							onClick={handleBack}
							className="flex items-center gap-2 text-sm font-medium text-neutral/70 hover:text-neutral transition cursor-pointer">
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 19l-7-7 7-7"
								/>
							</svg>
							Kembali
						</button>
					) : (
						<div />
					)}

					{step < 7 ? (
						<button
							type="button"
							onClick={handleNext}
							disabled={!isStepValid()}
							className={`px-6 py-2.5 text-sm font-medium rounded-full transition flex items-center gap-2 shadow-sm ${
								isStepValid()
									? "bg-primary text-white hover:opacity-90 cursor-pointer"
									: "bg-neutral/20 text-neutral/40 cursor-not-allowed"
							}`}>
							Lanjut
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</button>
					) : (
						<button
							type="button"
							onClick={() => navigate("/dashboard")}
							className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-full hover:opacity-90 transition flex items-center gap-2 shadow-sm cursor-pointer">
							Lihat Dashboard
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
