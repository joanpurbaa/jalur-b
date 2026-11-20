import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	ArrowRight,
	Building2,
	Check,
	CheckCircle2,
	Coins,
	Gift,
	Lock,
	Scale,
	ShieldCheck,
	Sparkles,
	Users,
} from "lucide-react";
import Card from "../components/ui/Card";
import IconTile from "../components/ui/IconTile";
import { PrimaryButton, SecondaryButton } from "../components/ui/PrimaryButton";
import { PageTransition, Stagger, StaggerItem } from "../components/ui/Motion";
import DemoCacheControl from "../components/ui/DemoCacheControl";
import { useCredits } from "../context/CreditsContext";
import {
	CREDIT_FEATURES,
	SALARY_TIERS,
	detectSalaryTier,
	type CreditFeatureId,
} from "../lib/credits";
import { useAuth } from "../context/AuthContext";
import { employmentTermsApi } from "../services/employmentTerms";
import { formatRupiah } from "../lib/format";
import { parseDecimal } from "../lib/parseNumeric";

const FREE_FEATURES = [
	{
		title: "Profil & kelengkapan karier",
		detail: "Data peran, pengalaman, dan ringkasan kesiapan fondasi.",
	},
	{
		title: "Financial runway semua cara keluar",
		detail: "Simulasi ketahanan dana untuk 6 skenario pemutusan kerja.",
	},
	{
		title: "Transition Gap untuk 1 peran utama",
		detail: "Selisih antara runway dan waktu persiapan + cari kerja.",
	},
	{
		title: "Hak pesangon, UPMK, JKP & tenggat klaim",
		detail: "Sesuai PP 35/2021, PP 6/2025, dan PP 68/2009 — tidak pernah dikunci.",
	},
	{
		title: "1 assessment dasar per bulan",
		detail: "Skor Kesehatan Karier, Risiko Karier, Skill & AI, serta Jalur Karier.",
	},
	{
		title: "Impor CV pertama",
		detail: "Ekstraksi otomatis riwayat pengalaman kerja dan koleksi skill.",
	},
];

const CREDIT_ITEMS = Object.values(CREDIT_FEATURES);

export default function Harga() {
	const navigate = useNavigate();
	const location = useLocation();
	const { status } = useAuth();
	const { balance, trialGranted, addMockCredits, requestUnlock, isUnlocked } =
		useCredits();
	const isAuthenticated = status === "authenticated";

	const fromFeatureId = (
		location.state as { fromFeature?: CreditFeatureId } | null
	)?.fromFeature;
	const targetFeature = fromFeatureId ? CREDIT_FEATURES[fromFeatureId] : null;

	const [detectedWage, setDetectedWage] = useState<number | null>(null);
	const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
	const [demoMessage, setDemoMessage] = useState<string | null>(null);

	useEffect(() => {
		if (!isAuthenticated) return;
		let active = true;
		employmentTermsApi
			.get()
			.then((res) => {
				if (!active || !res?.monthly_wage_base) return;
				const wage = parseDecimal(res.monthly_wage_base);
				if (wage > 0) {
					setDetectedWage(wage);
				}
			})
			.catch(() => {
				// ketentuan kerja belum diisi — biarkan null
			});
		return () => {
			active = false;
		};
	}, [isAuthenticated]);

	const autoTierId = detectSalaryTier(detectedWage);
	const activeTierId = autoTierId ?? selectedTierId ?? "tier_2";

	const handleSelectPack = (tierLabel: string, credits: number) => {
		if (!isAuthenticated) {
			navigate("/register");
			return;
		}
		addMockCredits(credits);
		setDemoMessage(
			`Mode demo: +${credits} B-Credits (${tierLabel}) berhasil ditambahkan ke saldo tanpa pembayaran sungguhan.`,
		);
	};

	return (
		<div className="min-h-screen bg-app text-slate-900 font-sans">
			{/* Top Bar */}
			<header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
				<div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<Link
							to={isAuthenticated ? "/dashboard/beranda" : "/"}
							className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-700 transition">
							<ArrowLeft size={16} />
							<span>{isAuthenticated ? "Kembali ke Dashboard" : "Beranda"}</span>
						</Link>
					</div>

					<Link
						to={isAuthenticated ? "/dashboard/beranda" : "/"}
						className="hidden sm:flex items-center gap-2">
						<img
							src="/icon.png"
							alt="Logo Jalur B"
							className="w-7 h-7 rounded-lg object-contain"
						/>
						<span className="font-bold text-slate-900 text-base">Jalur B</span>
					</Link>

					<div className="flex items-center gap-2">
						{isAuthenticated ? (
							<>
								<DemoCacheControl />
								<span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-800 tabular">
									<Coins size={13} className="text-indigo-600" />
									Saldo: {balance} credit
								</span>
							</>
						) : (
							<>
								<Link
									to="/login"
									className="text-sm font-medium text-slate-600 hover:text-indigo-700 px-3 py-2 transition">
									Masuk
								</Link>
								<PrimaryButton size="sm" onClick={() => navigate("/register")}>
									Daftar Gratis
								</PrimaryButton>
							</>
						)}
					</div>
				</div>
			</header>

			<main className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
				<PageTransition routeKey="harga">
					{/* Hero Heading */}
					<div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-700 mb-4">
							<Coins size={13} />
							Model B-Credits · Bayar Sesuai Pakai
						</span>
						<h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-slate-900 tracking-tight leading-tight">
							Hak dasar selalu gratis.{" "}
							<span className="font-[Georgia,serif] italic font-normal text-indigo-600">
								Analisis lanjutan sesuai gaji.
							</span>
						</h1>
						<p className="text-sm sm:text-base text-slate-600 mt-3.5 leading-relaxed max-w-2xl mx-auto">
							Tidak ada langganan bulanan yang mengikat dan tidak ada iklan.
							Perhitungan runway, hak pesangon/JKP, dan Transition Gap untuk peran
							pertama gratis selamanya.
						</p>
					</div>

					{/* Context banner ketika user datang dari panah kartu terkunci */}
					{targetFeature && !isUnlocked(targetFeature.id) && (
						<div className="max-w-3xl mx-auto mb-8 rounded-2xl border border-indigo-200 bg-indigo-50/75 px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
							<div className="flex items-start gap-3">
								<IconTile icon={Lock} tone="indigo" size="sm" />
								<div>
									<p className="text-xs font-semibold text-indigo-700">
										Membuka Fitur Terkunci · {targetFeature.cost} credit
									</p>
									<p className="text-sm font-bold text-slate-900 mt-0.5">
										{targetFeature.label}
									</p>
									<p className="text-xs text-slate-600 mt-0.5">
										Pilih paket B-Credits di bawah sesuai kelompok gajimu
										{balance >= targetFeature.cost
											? ", atau langsung pakai saldo credit yang sudah kamu miliki."
											: "."}
									</p>
								</div>
							</div>
							{isAuthenticated && balance >= targetFeature.cost && (
								<PrimaryButton
									size="sm"
									icon={<Sparkles size={14} />}
									onClick={() =>
										requestUnlock(targetFeature.id, () => navigate(-1))
									}>
									Pakai {targetFeature.cost} Credit
								</PrimaryButton>
							)}
						</div>
					)}

					{/* Demo confirmation banner */}
					{demoMessage && (
						<div className="max-w-3xl mx-auto mb-8 rounded-xl border border-emerald-200 bg-emerald-50/90 px-4 py-3.5 flex items-center justify-between gap-3 text-xs sm:text-sm text-emerald-950">
							<div className="flex items-center gap-2.5">
								<CheckCircle2 size={18} className="text-emerald-700 shrink-0" />
								<span className="font-medium">{demoMessage}</span>
							</div>
							<button
								type="button"
								onClick={() => setDemoMessage(null)}
								className="text-xs font-semibold text-emerald-800 hover:underline shrink-0 cursor-pointer">
								Tutup
							</button>
						</div>
					)}

					{/* Trial Highlight Banner */}
					<Card
						variant="hero"
						padding="md"
						className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div className="flex items-start gap-3.5">
							<IconTile icon={Gift} tone="indigo" size="md" />
							<div>
								<div className="flex flex-wrap items-center gap-2">
									<h2 className="text-sm sm:text-base font-bold text-slate-900">
										Trial 6 credit gratis, berlaku 14 hari
									</h2>
									{trialGranted && (
										<span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
											Sudah aktif
										</span>
									)}
								</div>
								<p className="text-xs sm:text-sm text-slate-600 mt-1">
									Otomatis diberikan begitu kamu menyelesaikan simulasi ketahanan
									pertamamu — cukup untuk mencoba perbandingan peran dan rincian AI
									exposure.
								</p>
							</div>
						</div>
						<div className="shrink-0">
							<PrimaryButton
								size="sm"
								icon={<ArrowRight size={14} />}
								onClick={() =>
									navigate(
										isAuthenticated ? "/dashboard/simulasi" : "/register",
									)
								}>
								{isAuthenticated ? "Buka Simulasi" : "Mulai Simulasi Gratis"}
							</PrimaryButton>
						</div>
					</Card>

					{/* Section 1: Tabel Gratis vs B-Credits */}
					<section aria-label="Perbandingan Gratis vs B-Credits" className="mb-12">
						<div className="flex items-center gap-2.5 mb-4">
							<IconTile icon={Scale} tone="indigo" size="sm" />
							<div>
								<h2 className="text-lg sm:text-xl font-bold text-slate-900">
									Gratis Selamanya vs B-Credits
								</h2>
								<p className="text-xs sm:text-sm text-slate-600">
									Transparansi fitur apa yang selalu terbuka dan kapan credit digunakan
								</p>
							</div>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
							{/* Kolom Gratis */}
							<Card padding="lg" className="flex flex-col justify-between">
								<div>
									<div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
										<div className="flex items-center gap-2.5">
											<IconTile icon={ShieldCheck} tone="safe" size="sm" />
											<div>
												<h3 className="text-base font-bold text-slate-900">
													Gratis Selamanya
												</h3>
												<p className="text-xs text-slate-500">
													Tidak pernah dikunci untuk pekerja Indonesia
												</p>
											</div>
										</div>
										<span className="num-display text-xl text-emerald-700">
											Rp0
										</span>
									</div>

									<ul className="space-y-3.5">
										{FREE_FEATURES.map((item) => (
											<li
												key={item.title}
												className="flex items-start gap-2.5 text-sm">
												<CheckCircle2
													size={17}
													className="text-emerald-600 shrink-0 mt-0.5"
												/>
												<div>
													<p className="font-semibold text-slate-900 leading-snug">
														{item.title}
													</p>
													<p className="text-xs text-slate-600 mt-0.5">
														{item.detail}
													</p>
												</div>
											</li>
										))}
									</ul>
								</div>
							</Card>

							{/* Kolom B-Credits */}
							<Card
								padding="lg"
								className="border-indigo-200/90 flex flex-col justify-between">
								<div>
									<div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
										<div className="flex items-center gap-2.5">
											<IconTile icon={Sparkles} tone="indigo" size="sm" />
											<div>
												<h3 className="text-base font-bold text-slate-900">
													Analisis Lanjutan (B-Credits)
												</h3>
												<p className="text-xs text-slate-500">
													Hanya pakai saat kamu butuh eksplorasi lebih dalam
												</p>
											</div>
										</div>
										<span className="px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-700">
											Per fitur
										</span>
									</div>

									<ul className="space-y-3">
										{CREDIT_ITEMS.map((item) => (
											<li
												key={item.id}
												className="rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5 flex items-start justify-between gap-3">
												<div className="flex items-start gap-2.5 min-w-0">
													<Lock
														size={14}
														className="text-indigo-600 shrink-0 mt-1"
													/>
													<div className="min-w-0">
														<p className="text-sm font-semibold text-slate-900 leading-snug">
															{item.label}
														</p>
														<p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
															{item.description}
														</p>
													</div>
												</div>
												<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-indigo-200 text-xs font-bold text-indigo-700 shrink-0 tabular">
													<Coins size={11} />
													{item.cost} credit
												</span>
											</li>
										))}
									</ul>
								</div>
							</Card>
						</div>
					</section>

					{/* Section 2: 4 Kelompok Tarif Progresif Mengikuti Gaji */}
					<section aria-label="Kelompok Tarif Mengikuti Gaji" className="mb-12">
						<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
							<div className="flex items-start gap-2.5">
								<IconTile icon={Coins} tone="indigo" size="sm" />
								<div>
									<h2 className="text-lg sm:text-xl font-bold text-slate-900">
										4 Kelompok Tarif Mengikuti Gaji
									</h2>
									<p className="text-xs sm:text-sm text-slate-600 mt-0.5">
										Harga per credit disesuaikan secara adil dengan rentang
										penghasilan bulananmu.
									</p>
								</div>
							</div>

							{detectedWage != null ? (
								<span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-800 self-start sm:self-auto">
									<Check size={13} className="text-indigo-600" />
									Gajimu terdeteksi: {formatRupiah(detectedWage)}/bln
								</span>
							) : (
								<span className="text-xs text-slate-500">
									Isi upah pokok di Simulasi agar kelompokmu tersorot otomatis.
								</span>
							)}
						</div>

						<Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
							{SALARY_TIERS.map((tier) => {
								const isAutoMatch = autoTierId === tier.id;
								const isHighlighted = activeTierId === tier.id;

								return (
									<StaggerItem key={tier.id}>
										<div
											onClick={() => {
												if (!autoTierId) setSelectedTierId(tier.id);
											}}
											className={`h-full rounded-2xl p-5 flex flex-col justify-between transition border ${
												isHighlighted
													? "bg-white border-2 border-indigo-600 ring-4 ring-indigo-600/10 shadow-md"
													: "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
											} ${!autoTierId ? "cursor-pointer" : ""}`}>
											<div>
												<div className="flex items-center justify-between gap-2 mb-3">
													<span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
														{tier.label}
													</span>
													{isAutoMatch ? (
														<span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-semibold">
															Tarif Kamu
														</span>
													) : isHighlighted ? (
														<span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-semibold">
															Dipilih
														</span>
													) : null}
												</div>

												<p className="text-sm font-bold text-slate-900">
													{tier.rangeLabel}
												</p>
												<p className="text-xs text-slate-500 mt-1 leading-relaxed">
													{tier.description}
												</p>

												<div className="mt-5 pt-4 border-t border-slate-100">
													<p className="text-xs font-medium text-slate-500">
														Harga paket {tier.packCredits} credit
													</p>
													<div className="flex items-baseline gap-1 mt-1">
														<span className="num-display text-3xl text-slate-900">
															Rp{(tier.packPrice / 1000).toLocaleString("id-ID")}rb
														</span>
														<span className="text-xs text-slate-500 font-medium">
															/ 20 credit
														</span>
													</div>
													<p className="text-xs font-semibold text-indigo-700 mt-1 tabular">
														Rp{tier.pricePerCredit.toLocaleString("id-ID")} per credit
													</p>
												</div>
											</div>

											<div className="mt-5">
												{isHighlighted ? (
													<PrimaryButton
														size="sm"
														fullWidth
														icon={<Coins size={14} />}
														onClick={() =>
															handleSelectPack(tier.label, tier.packCredits)
														}>
														{isAuthenticated
															? "Coba +20 Credit (Demo)"
															: "Mulai dengan Tarif Ini"}
													</PrimaryButton>
												) : (
													<SecondaryButton
														size="sm"
														fullWidth
														onClick={() =>
															handleSelectPack(tier.label, tier.packCredits)
														}>
														{isAuthenticated
															? "Coba +20 Credit (Demo)"
															: "Pilih Paket"}
													</SecondaryButton>
												)}
											</div>
										</div>
									</StaggerItem>
								);
							})}
						</Stagger>
					</section>

					{/* Section 3: Baris B2B2C */}
					<section aria-label="Paket B2B2C Perusahaan dan Serikat" className="mb-10">
						<Card
							padding="lg"
							className="bg-indigo-950 border-indigo-900 text-white">
							<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
								<div className="flex items-start gap-4 max-w-2xl">
									<span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 border border-white/15 text-indigo-200 shrink-0">
										<Building2 size={22} />
									</span>
									<div>
										<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-200 mb-1">
											<Users size={13} />
											Program B2B2C · Untuk Perusahaan &amp; Serikat Pekerja
										</span>
										<h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
											Bantu karyawan bertransisi dengan bermartabat &amp; terukur
										</h3>
										<p className="text-sm text-indigo-100/80 mt-2 leading-relaxed">
											Cocok untuk program <em>career resilience</em>,{" "}
											<em>outplacement</em>, atau manfaat keanggotaan serikat
											pekerja. Akses penuh simulasi ketahanan, pemetaan skill, dan
											edukasi hak normatif PP 35/2021 &amp; PP 6/2025.
										</p>
									</div>
								</div>

								<div className="lg:text-right shrink-0 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-white/15 pt-5 lg:pt-0 lg:pl-8">
									<div>
										<p className="text-xs font-medium text-indigo-200">
											Tarif kemitraan B2B2C
										</p>
										<p className="num-display text-3xl sm:text-4xl text-white mt-1">
											Rp15rb
											<span className="text-sm font-medium text-indigo-200">
												{" "}
												/ pekerja / bulan
											</span>
										</p>
									</div>
									<a
										href="mailto:halo@jalurb.id?subject=Kemitraan%20B2B2C%20Jalur%20B"
										className="press inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-white text-indigo-950 hover:bg-indigo-50 text-sm font-semibold transition">
										<span>Ajukan Kemitraan</span>
										<ArrowRight size={15} />
									</a>
								</div>
							</div>
						</Card>
					</section>

					{/* Trust footnote */}
					<div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 pt-4 border-t border-slate-200">
						<span className="inline-flex items-center gap-1.5">
							<ShieldCheck size={14} className="text-emerald-600" />
							Tidak ada iklan
						</span>
						<span className="inline-flex items-center gap-1.5">
							<Scale size={14} className="text-indigo-600" />
							Hak normatif selalu gratis
						</span>
						<span className="inline-flex items-center gap-1.5">
							<Coins size={14} className="text-slate-500" />
							Versi demo — tidak ada transaksi pembayaran sungguhan
						</span>
					</div>
				</PageTransition>
			</main>
		</div>
	);
}
