import { useEffect, useState } from "react";
import {
	Briefcase,
	Landmark,
	Info,
	Clock,
	Calendar,
	Target,
	CheckSquare,
	Square,
	AlertCircle,
	CheckCircle2,
	Edit2,
	DollarSign,
	ArrowRight,
	ArrowLeft,
	PlaySquare,
} from "lucide-react";
import {
	getHealthStatus,
	getLevelStatus,
	localizeLevelLabel,
	normalizeRiskLevel,
} from "../../../lib/status";
import { formatMonths } from "../../../lib/format";
import StatusBadge from "../../ui/StatusBadge";
import InfoStat from "../../ui/InfoStat";
import Card from "../../ui/Card";
import IconTile from "../../ui/IconTile";
import { PrimaryButton, SecondaryButton } from "../../ui/PrimaryButton";
import ExitTypePicker, { exitTypeOptions } from "./ScenarioPicker";
import { profileApi } from "../../../services/profile";
import { careerHealthApi } from "../../../services/careerHealth";
import { careerRiskApi } from "../../../services/careerRisk";
import { aiExposureApi } from "../../../services/aiExposure";
import { financialApi } from "../../../services/financial";
import { careerPivotApi } from "../../../services/careerPivot";
import { employmentTermsApi } from "../../../services/employmentTerms";
import { parseDecimal } from "../../../lib/parseNumeric";
import type {
	ExitType,
	LayoffSimulationRequest,
} from "../../../types/layoffSimulation";
import type {
	EmploymentTermsResponse,
	EmploymentTermsUpsert,
	EmploymentType,
} from "../../../types/employmentTerms";

interface SimulationSetupProps {
	config: LayoffSimulationRequest;
	onChangeConfig: (config: LayoffSimulationRequest) => void;
	onStart: () => void;
}

interface SetupConditions {
	role: string | null;
	tenure: string | null;
	careerHealth: number | null;
	careerHealthStatus: string | null;
	careerRisk: string | null;
	aiExposure: number | null;
	skillRelevance: number | null;
	liquidAssets: string | null;
	essentialExpenses: string | null;
	debtPayment: string | null;
	dependents: number | null;
	runwayMonths: number | null;
}

function clampPercent(value: string): number {
	return Math.min(100, Math.max(0, Math.round(parseDecimal(value))));
}

function formatTenure(months: number): string {
	const years = Math.floor(months / 12);
	const rest = months % 12;
	if (years > 0 && rest > 0) return `${years} thn ${rest} bln`;
	if (years > 0) return `${years} thn`;
	if (rest > 0) return `${rest} bln`;
	return "";
}

function formatRupiah(raw?: string | number | null): string {
	if (raw === null || raw === undefined || raw === "") return "—";
	const n = Number(raw);
	return Number.isFinite(n) ? `Rp ${n.toLocaleString("id-ID")}` : "—";
}

const emptyConditions: SetupConditions = {
	role: null,
	tenure: null,
	careerHealth: null,
	careerHealthStatus: null,
	careerRisk: null,
	aiExposure: null,
	skillRelevance: null,
	liquidAssets: null,
	essentialExpenses: null,
	debtPayment: null,
	dependents: null,
	runwayMonths: null,
};

const searchPresetMonths = [1, 3, 6, 9, 12];
const horizonPresetMonths = [6, 12, 18, 24, 36];

const WIZARD_STEPS = [
	{ id: 1, title: "Skenario & Kontrak", sub: "Jenis PHK & ketentuan kerja" },
	{ id: 2, title: "Asumsi Waktu", sub: "Durasi cari kerja & horizon" },
	{ id: 3, title: "Target Peran", sub: "Posisi tujuan transisi" },
] as const;

export default function SimulationSetup({
	config,
	onChangeConfig,
	onStart,
}: SimulationSetupProps) {
	const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
	const [conditions, setConditions] = useState<SetupConditions>(emptyConditions);
	const [pivotSuggestions, setPivotSuggestions] = useState<string[]>([]);
	const [terms, setTerms] = useState<EmploymentTermsResponse | null>(null);
	const [termsLoading, setTermsLoading] = useState(true);
	const [showTermsEditor, setShowTermsEditor] = useState(false);
	const [termsError, setTermsError] = useState<string | null>(null);
	const [savingTerms, setSavingTerms] = useState(false);

	const [termsForm, setTermsForm] = useState<EmploymentTermsUpsert>({
		monthly_wage_base: "",
		employment_type: "pkwtt",
		tenure_months: 12,
		bpjs_tk_active: true,
		jkn_active: true,
		unused_leave_days: 0,
	});

	useEffect(() => {
		let active = true;
		const load = async () => {
			const [profile, health, risk, exposure, financial, pivot, termsRes] =
				await Promise.allSettled([
					profileApi.get(),
					careerHealthApi.latest(),
					careerRiskApi.latest(),
					aiExposureApi.latest(),
					financialApi.get(),
					careerPivotApi.latest(),
					employmentTermsApi.get(),
				]);
			if (!active) return;

			const next: SetupConditions = { ...emptyConditions };
			let defaultTenure = 12;

			if (profile.status === "fulfilled") {
				const p = profile.value.profile;
				next.role = p?.current_role_name ?? null;
				if (p?.work_duration_months != null) {
					defaultTenure = p.work_duration_months;
					next.tenure = formatTenure(p.work_duration_months);
				}
			}

			if (health.status === "fulfilled") {
				next.careerHealth = clampPercent(health.value.score);
				next.careerHealthStatus = health.value.status;
			}

			if (risk.status === "fulfilled") {
				next.careerRisk = normalizeRiskLevel(risk.value.level);
			}

			if (exposure.status === "fulfilled") {
				next.aiExposure = clampPercent(exposure.value.score);
				next.skillRelevance = clampPercent(
					exposure.value.skill_relevance_score,
				);
			}

			if (financial.status === "fulfilled") {
				const f = financial.value;
				next.liquidAssets = f.runway?.liquid_assets ?? null;
				next.essentialExpenses = f.profile?.monthly_essential_expenses ?? null;
				next.debtPayment = f.profile?.monthly_debt_payment ?? null;
				next.dependents = f.profile?.dependents ?? null;
				next.runwayMonths = f.runway
					? parseDecimal(f.runway.financial_runway_months) || null
					: null;
			}

			if (pivot.status === "fulfilled") {
				const roles = pivot.value.roles.map((r) => r.role_name).slice(0, 4);
				setPivotSuggestions(roles);
			}

			if (termsRes.status === "fulfilled" && termsRes.value) {
				const t = termsRes.value;
				setTerms(t);
				setTermsForm({
					monthly_wage_base: t.monthly_wage_base,
					employment_type: t.employment_type ?? "pkwtt",
					tenure_months: t.tenure_months ?? defaultTenure,
					bpjs_tk_active: t.bpjs_tk_active ?? true,
					jkn_active: t.jkn_active ?? true,
					unused_leave_days: t.unused_leave_days ?? 0,
				});
				setShowTermsEditor(false);
			} else {
				setTerms(null);
				setShowTermsEditor(true);
				setTermsForm((prev) => ({
					...prev,
					tenure_months: defaultTenure,
				}));
			}

			setTermsLoading(false);
			setConditions(next);
		};
		void load();
		return () => {
			active = false;
		};
	}, []);

	const healthVariant = getHealthStatus(
		conditions.careerHealthStatus,
		conditions.careerHealth ?? undefined,
	);
	const riskVariant = conditions.careerRisk
		? getLevelStatus(normalizeRiskLevel(conditions.careerRisk))
		: "neutral";

	const updateConfig = <K extends keyof LayoffSimulationRequest>(
		key: K,
		value: LayoffSimulationRequest[K],
	) => {
		onChangeConfig({
			...config,
			[key]: value,
		});
	};

	const currentExitType: ExitType =
		config.exit_type ?? "efficiency_due_to_loss";
	const currentSearchMonths = Number(config.search_time_months) || 3;
	const currentHorizonMonths = Number(config.horizon_months) || 12;
	const isNormativeCollectable = config.normative_rights_collectable ?? true;

	const selectedExitLabel =
		exitTypeOptions.find((o) => o.id === currentExitType)?.label ??
		currentExitType;

	const handleStart = async () => {
		setTermsError(null);

		if (!terms || showTermsEditor) {
			const wageNumber = Number(termsForm.monthly_wage_base);
			if (
				!termsForm.monthly_wage_base ||
				Number.isNaN(wageNumber) ||
				wageNumber <= 0
			) {
				setTermsError(
					"Upah pokok bulanan wajib diisi dengan nominal yang valid (di atas 0).",
				);
				setShowTermsEditor(true);
				setWizardStep(1);
				return;
			}

			try {
				setSavingTerms(true);
				const saved = await employmentTermsApi.upsert({
					...termsForm,
					monthly_wage_base: wageNumber,
					assumed_exit_type: currentExitType,
				});
				setTerms(saved);
				setShowTermsEditor(false);
			} catch (err: unknown) {
				setTermsError(
					err instanceof Error
						? err.message
						: "Gagal menyimpan ketentuan kerja. Silakan coba lagi.",
				);
				setWizardStep(1);
				return;
			} finally {
				setSavingTerms(false);
			}
		}

		onStart();
	};

	return (
		<div className="space-y-6">
			{/* Ringkasan Kondisi Awal (Karier & Finansial) */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
				<Card padding="md">
					<div className="flex items-center gap-3 pb-3.5 mb-4 border-b border-slate-100">
						<IconTile icon={Briefcase} tone="neutral" size="sm" />
						<div>
							<h3 className="text-sm font-bold text-slate-900">
								Data Dasar Karier
							</h3>
							<p className="text-xs text-slate-500">
								Diambil otomatis dari profil dan penilaianmu
							</p>
						</div>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
						<InfoStat label="Role" value={conditions.role ?? "—"} />
						<InfoStat label="Lama Bekerja" value={conditions.tenure ?? "—"} />
						<InfoStat
							label="Career Health"
							value={
								conditions.careerHealth != null
									? `${conditions.careerHealth}/100`
									: "—"
							}
							badge={
								conditions.careerHealth != null &&
								conditions.careerHealthStatus ? (
									<StatusBadge
										label={localizeLevelLabel(conditions.careerHealthStatus)}
										variant={healthVariant}
										size="sm"
									/>
								) : undefined
							}
						/>
						<InfoStat
							label="Career Risk"
							value={conditions.careerRisk ?? "—"}
							badge={
								conditions.careerRisk ? (
									<StatusBadge
										label={conditions.careerRisk}
										variant={riskVariant}
										size="sm"
									/>
								) : undefined
							}
						/>
						<InfoStat
							label="Paparan AI"
							value={
								conditions.aiExposure != null
									? `${conditions.aiExposure}%`
									: "—"
							}
						/>
						<InfoStat
							label="Relevansi Skill"
							value={
								conditions.skillRelevance != null
									? `${conditions.skillRelevance}%`
									: "—"
							}
						/>
					</div>
				</Card>

				<Card padding="md">
					<div className="flex items-center gap-3 pb-3.5 mb-4 border-b border-slate-100">
						<IconTile icon={Landmark} tone="neutral" size="sm" />
						<div>
							<h3 className="text-sm font-bold text-slate-900">
								Data Dasar Finansial
							</h3>
							<p className="text-xs text-slate-500">
								Basis perhitungan dana cadangan & pengeluaran
							</p>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4 mb-4">
						<InfoStat
							label="Tabungan Darurat (Liquid)"
							value={formatRupiah(conditions.liquidAssets)}
						/>
						<InfoStat
							label="Jumlah Tanggungan"
							value={
								conditions.dependents != null
									? `${conditions.dependents} orang`
									: "—"
							}
						/>
						<InfoStat
							label="Pengeluaran Rutin"
							value={
								conditions.essentialExpenses
									? `${formatRupiah(conditions.essentialExpenses)}/bln`
									: "—"
							}
						/>
						<InfoStat
							label="Cicilan"
							value={
								conditions.debtPayment
									? `${formatRupiah(conditions.debtPayment)}/bln`
									: "—"
							}
						/>
					</div>
					<div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 flex items-center justify-between">
						<div>
							<p className="text-xs font-semibold text-slate-700">
								Runway Tanpa Pesangon
							</p>
							<p className="text-xs text-slate-500">
								Sebelum komponen kompensasi PHK
							</p>
						</div>
						<p className="num-display text-xl text-indigo-700">
							{conditions.runwayMonths != null
								? formatMonths(conditions.runwayMonths)
								: "—"}
						</p>
					</div>
				</Card>
			</div>

			{/* Wizard 3 Langkah + Ringkasan Sticky */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
				<div className="lg:col-span-8 space-y-5">
					{/* Stepper Bar 3 Langkah */}
					<Card padding="sm">
						<div className="grid grid-cols-3 gap-2">
							{WIZARD_STEPS.map((s) => {
								const active = wizardStep === s.id;
								const done = wizardStep > s.id;
								return (
									<button
										key={s.id}
										type="button"
										onClick={() => setWizardStep(s.id)}
										className={`press rounded-xl p-3 text-left transition border cursor-pointer flex items-center gap-2.5 ${
											active
												? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
												: done
													? "bg-indigo-50/70 border-indigo-200 text-indigo-900"
													: "bg-slate-50 border-slate-200 text-slate-600 hover:bg-white"
										}`}>
										<span
											className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold shrink-0 ${
												active
													? "bg-white/20 text-white"
													: done
														? "bg-indigo-600 text-white"
														: "bg-slate-200 text-slate-700"
											}`}>
											{done ? "✓" : s.id}
										</span>
										<div className="min-w-0">
											<p className="text-xs font-semibold truncate">
												{s.title}
											</p>
											<p
												className={`text-[11px] truncate hidden sm:block ${
													active ? "text-indigo-100" : "text-slate-500"
												}`}>
												{s.sub}
											</p>
										</div>
									</button>
								);
							})}
						</div>
					</Card>

					{/* LANGKAH 1: Skenario & Ketentuan Kerja */}
					{wizardStep === 1 && (
						<Card padding="lg" className="space-y-6">
							<div>
								<span className="text-xs font-semibold text-indigo-700">
									Langkah 1 dari 3
								</span>
								<h3 className="text-lg font-bold text-slate-900 mt-0.5">
									Pilih Skenario PHK & Ketentuan Kerja
								</h3>
								<p className="text-sm text-slate-600 mt-1">
									Jenis berhentinya hubungan kerja menentukan rumus uang pesangon,
									penghargaan masa kerja, dan kompensasi menurut PP 35/2021.
								</p>
							</div>

							{/* Ketentuan Kerja / Employment Terms */}
							<div className="rounded-xl bg-slate-50/80 p-4 sm:p-5 border border-slate-200 space-y-4">
								<div className="flex items-center justify-between gap-2">
									<div className="flex items-center gap-2.5">
										<IconTile icon={DollarSign} tone="indigo" size="xs" />
										<h4 className="text-sm font-bold text-slate-900">
											Ketentuan Kerja (Employment Terms)
										</h4>
									</div>
									{terms && !showTermsEditor && (
										<button
											type="button"
											onClick={() => setShowTermsEditor(true)}
											className="text-xs font-semibold text-indigo-700 flex items-center gap-1 hover:underline cursor-pointer">
											<Edit2 size={13} />
											Ubah
										</button>
									)}
								</div>

								{termsLoading ? (
									<p className="text-xs text-slate-500">
										Memuat data ketentuan kerja…
									</p>
								) : terms && !showTermsEditor ? (
									<div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 pt-1">
										<div>
											<span className="text-slate-500">Gaji Pokok: </span>
											<span className="font-bold text-slate-900">
												{formatRupiah(terms.monthly_wage_base)}/bln
											</span>
										</div>
										<div>
											<span className="text-slate-500">Status: </span>
											<span className="font-semibold text-slate-900 uppercase">
												{terms.employment_type === "pkwtt"
													? "Tetap (PKWTT)"
													: "Kontrak (PKWT)"}
											</span>
										</div>
										<div>
											<span className="text-slate-500">Masa Kerja: </span>
											<span className="font-semibold text-slate-900">
												{terms.tenure_months != null
													? formatTenure(terms.tenure_months)
													: "—"}
											</span>
										</div>
										<div>
											<span className="text-slate-500">BPJS TK: </span>
											<span className="font-semibold text-slate-900">
												{terms.bpjs_tk_active ? "Aktif" : "Tidak"}
											</span>
										</div>
										<div className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
											<CheckCircle2 size={14} />
											<span>Lengkap</span>
										</div>
									</div>
								) : (
									<div className="space-y-4 pt-1">
										{!terms && (
											<div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs">
												<AlertCircle size={16} className="shrink-0 mt-0.5" />
												<p>
													<strong>Data ketentuan kerja belum terisi.</strong>{" "}
													Masukkan upah pokok dan status kerja agar Jalur B dapat
													menghitung hak pesangon & manfaat JKP secara akurat.
												</p>
											</div>
										)}

										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<div>
												<label
													htmlFor="monthly_wage_base"
													className="block text-xs font-semibold text-slate-700 mb-1">
													Gaji Pokok / Upah Bulanan (Rp){" "}
													<span className="text-rose-600">*</span>
												</label>
												<input
													id="monthly_wage_base"
													type="number"
													min={1}
													placeholder="contoh: 12000000"
													value={termsForm.monthly_wage_base}
													onChange={(e) =>
														setTermsForm((prev) => ({
															...prev,
															monthly_wage_base: e.target.value,
														}))
													}
													className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
												/>
												<p className="text-xs text-slate-500 mt-1">
													Upah pokok + tunjangan tetap sesuai kontrak.
												</p>
											</div>

											<div>
												<label className="block text-xs font-semibold text-slate-700 mb-1">
													Status Karyawan
												</label>
												<div className="grid grid-cols-2 gap-2">
													<button
														type="button"
														onClick={() =>
															setTermsForm((prev) => ({
																...prev,
																employment_type: "pkwtt" as EmploymentType,
															}))
														}
														className={`press min-h-[42px] py-2 px-3 text-xs font-semibold rounded-xl border text-center transition cursor-pointer ${
															termsForm.employment_type === "pkwtt"
																? "bg-indigo-600 text-white border-indigo-600"
																: "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
														}`}>
														Tetap (PKWTT)
													</button>
													<button
														type="button"
														onClick={() =>
															setTermsForm((prev) => ({
																...prev,
																employment_type: "pkwt" as EmploymentType,
															}))
														}
														className={`press min-h-[42px] py-2 px-3 text-xs font-semibold rounded-xl border text-center transition cursor-pointer ${
															termsForm.employment_type === "pkwt"
																? "bg-indigo-600 text-white border-indigo-600"
																: "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
														}`}>
														Kontrak (PKWT)
													</button>
												</div>
											</div>

											<div>
												<label
													htmlFor="tenure_months"
													className="block text-xs font-semibold text-slate-700 mb-1">
													Masa Kerja di Perusahaan (Bulan)
												</label>
												<input
													id="tenure_months"
													type="number"
													min={0}
													max={960}
													value={termsForm.tenure_months ?? 12}
													onChange={(e) =>
														setTermsForm((prev) => ({
															...prev,
															tenure_months: Number(e.target.value) || 0,
														}))
													}
													className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
												/>
												<p className="text-xs text-slate-500 mt-1">
													{termsForm.tenure_months
														? formatTenure(Number(termsForm.tenure_months))
														: "—"}
												</p>
											</div>

											<div>
												<label
													htmlFor="unused_leave_days"
													className="block text-xs font-semibold text-slate-700 mb-1">
													Sisa Cuti Tahunan (Hari, Opsional)
												</label>
												<input
													id="unused_leave_days"
													type="number"
													min={0}
													max={365}
													value={termsForm.unused_leave_days ?? 0}
													onChange={(e) =>
														setTermsForm((prev) => ({
															...prev,
															unused_leave_days: Number(e.target.value) || 0,
														}))
													}
													className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
												/>
											</div>
										</div>

										<div className="flex items-center justify-between gap-2 pt-1">
											<button
												type="button"
												onClick={() =>
													setTermsForm((prev) => ({
														...prev,
														bpjs_tk_active: !prev.bpjs_tk_active,
													}))
												}
												className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
												{termsForm.bpjs_tk_active ? (
													<CheckSquare size={16} className="text-indigo-600" />
												) : (
													<Square size={16} className="text-slate-400" />
												)}
												<span>
													Peserta aktif BPJS Ketenagakerjaan (program JKP & JHT)
												</span>
											</button>

											{terms && (
												<button
													type="button"
													onClick={() => setShowTermsEditor(false)}
													className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer">
													Tutup
												</button>
											)}
										</div>
									</div>
								)}

								{termsError && (
									<p className="text-xs font-semibold text-rose-800 bg-rose-50 p-3 rounded-xl border border-rose-200">
										{termsError}
									</p>
								)}
							</div>

							<div>
								<label className="block text-xs font-semibold text-slate-700 mb-3">
									Pilih Jenis Skenario PHK
								</label>
								<ExitTypePicker
									selected={currentExitType}
									options={exitTypeOptions}
									onSelect={(id) => updateConfig("exit_type", id)}
								/>
							</div>

							<div className="flex justify-end pt-2">
								<PrimaryButton
									icon={<ArrowRight size={15} />}
									onClick={() => setWizardStep(2)}>
									Lanjut ke Asumsi Waktu
								</PrimaryButton>
							</div>
						</Card>
					)}

					{/* LANGKAH 2: Asumsi Waktu & Hak Normatif */}
					{wizardStep === 2 && (
						<Card padding="lg" className="space-y-6">
							<div>
								<span className="text-xs font-semibold text-indigo-700">
									Langkah 2 dari 3
								</span>
								<h3 className="text-lg font-bold text-slate-900 mt-0.5">
									Atur Estimasi Waktu & Hak Normatif
								</h3>
								<p className="text-sm text-slate-600 mt-1">
									Geser pengatur atau pilih durasi bulan untuk melihat
									pengaruhnya pada proyeksi ketahananmu.
								</p>
							</div>

							<div className="space-y-5">
								<div className="rounded-xl bg-slate-50 p-5 border border-slate-200 space-y-3">
									<div className="flex items-center justify-between gap-2">
										<div className="flex items-center gap-2.5">
											<IconTile icon={Clock} tone="indigo" size="xs" />
											<label
												htmlFor="search_time_months"
												className="text-sm font-semibold text-slate-900">
												Estimasi Waktu Cari Kerja
											</label>
										</div>
										<span className="num-display text-xl text-indigo-700">
											{currentSearchMonths} bln
										</span>
									</div>
									<p className="text-xs text-slate-600">
										Perkiraan durasi hingga kamu mendapatkan pekerjaan baru.
									</p>
									<input
										id="search_time_months"
										type="range"
										min={1}
										max={24}
										value={currentSearchMonths}
										onChange={(e) =>
											updateConfig(
												"search_time_months",
												Math.max(1, Math.min(24, Number(e.target.value) || 1)),
											)
										}
										className="w-full accent-indigo-600 cursor-pointer"
									/>
									<div className="flex flex-wrap gap-2 pt-1">
										{searchPresetMonths.map((m) => (
											<button
												key={m}
												type="button"
												onClick={() => updateConfig("search_time_months", m)}
												className={`press min-h-[36px] px-3 py-1.5 text-xs rounded-xl font-semibold transition cursor-pointer ${
													currentSearchMonths === m
														? "bg-indigo-600 text-white"
														: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
												}`}>
												{m} bln
											</button>
										))}
									</div>
								</div>

								<div className="rounded-xl bg-slate-50 p-5 border border-slate-200 space-y-3">
									<div className="flex items-center justify-between gap-2">
										<div className="flex items-center gap-2.5">
											<IconTile icon={Calendar} tone="indigo" size="xs" />
											<label
												htmlFor="horizon_months"
												className="text-sm font-semibold text-slate-900">
												Horizon Perencanaan
											</label>
										</div>
										<span className="num-display text-xl text-indigo-700">
											{currentHorizonMonths} bln
										</span>
									</div>
									<p className="text-xs text-slate-600">
										Rentang waktu evaluasi proyeksi ketahanan finansialmu.
									</p>
									<input
										id="horizon_months"
										type="range"
										min={3}
										max={36}
										step={3}
										value={currentHorizonMonths}
										onChange={(e) =>
											updateConfig(
												"horizon_months",
												Math.max(1, Math.min(60, Number(e.target.value) || 12)),
											)
										}
										className="w-full accent-indigo-600 cursor-pointer"
									/>
									<div className="flex flex-wrap gap-2 pt-1">
										{horizonPresetMonths.map((m) => (
											<button
												key={m}
												type="button"
												onClick={() => updateConfig("horizon_months", m)}
												className={`press min-h-[36px] px-3 py-1.5 text-xs rounded-xl font-semibold transition cursor-pointer ${
													currentHorizonMonths === m
														? "bg-indigo-600 text-white"
														: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
												}`}>
												{m} bln
											</button>
										))}
									</div>
								</div>

								<button
									type="button"
									onClick={() =>
										updateConfig(
											"normative_rights_collectable",
											!isNormativeCollectable,
										)
									}
									className="press w-full rounded-xl bg-white p-4 border border-slate-200 flex items-start gap-3 text-left cursor-pointer hover:border-slate-300">
									<div className="mt-0.5">
										{isNormativeCollectable ? (
											<CheckSquare size={18} className="text-indigo-600" />
										) : (
											<Square size={18} className="text-slate-400" />
										)}
									</div>
									<div>
										<p className="text-sm font-semibold text-slate-900">
											Hak Normatif Dapat Dicairkan Penuh
										</p>
										<p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
											Centang bila uang pesangon, sisa cuti, atau kompensasi
											diasumsikan cair tepat waktu. Matikan untuk menguji
											skenario terburuk.
										</p>
									</div>
								</button>
							</div>

							<div className="flex items-center justify-between pt-2">
								<SecondaryButton
									icon={<ArrowLeft size={14} />}
									onClick={() => setWizardStep(1)}>
									Kembali
								</SecondaryButton>
								<PrimaryButton
									icon={<ArrowRight size={15} />}
									onClick={() => setWizardStep(3)}>
									Lanjut ke Target Peran
								</PrimaryButton>
							</div>
						</Card>
					)}

					{/* LANGKAH 3: Target Peran Tujuan */}
					{wizardStep === 3 && (
						<Card padding="lg" className="space-y-6">
							<div>
								<span className="text-xs font-semibold text-indigo-700">
									Langkah 3 dari 3
								</span>
								<h3 className="text-lg font-bold text-slate-900 mt-0.5">
									Target Peran Tujuan (Opsional)
								</h3>
								<p className="text-sm text-slate-600 mt-1">
									Masukkan posisi yang ingin kamu tuju saat mencari kerja kembali
									untuk menghitung kecocokan dan gap persiapan.
								</p>
							</div>

							<div className="rounded-xl bg-slate-50 p-5 border border-slate-200 space-y-3">
								<div className="flex items-center gap-2.5">
									<IconTile icon={Target} tone="indigo" size="xs" />
									<label
										htmlFor="preferred_role_name"
										className="text-sm font-semibold text-slate-900">
										Nama Peran / Posisi Tujuan
									</label>
								</div>
								<input
									id="preferred_role_name"
									type="text"
									maxLength={100}
									placeholder="contoh: Senior Frontend Engineer, Product Manager"
									value={config.preferred_role_name ?? ""}
									onChange={(e) =>
										updateConfig("preferred_role_name", e.target.value)
									}
									className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-indigo-600"
								/>

								{pivotSuggestions.length > 0 && (
									<div className="pt-2">
										<p className="text-xs font-medium text-slate-500 mb-2">
											Saran cepat dari analisis Jalur Kariermu:
										</p>
										<div className="flex flex-wrap gap-2">
											{pivotSuggestions.map((role) => (
												<button
													key={role}
													type="button"
													onClick={() =>
														updateConfig("preferred_role_name", role)
													}
													className={`press min-h-[36px] px-3 py-1.5 text-xs rounded-xl border font-semibold transition cursor-pointer ${
														config.preferred_role_name === role
															? "border-indigo-600 bg-indigo-600 text-white"
															: "border-slate-200 bg-white text-slate-700 hover:border-indigo-300"
													}`}>
													{role}
												</button>
											))}
										</div>
									</div>
								)}
							</div>

							<div className="flex items-center justify-between pt-2">
								<SecondaryButton
									icon={<ArrowLeft size={14} />}
									onClick={() => setWizardStep(2)}>
									Kembali
								</SecondaryButton>
								<PrimaryButton
									size="lg"
									icon={<PlaySquare size={16} />}
									onClick={() => void handleStart()}
									disabled={savingTerms || termsLoading}>
									{savingTerms ? "Menyimpan..." : "Jalankan Simulasi Sekarang"}
								</PrimaryButton>
							</div>
						</Card>
					)}
				</div>

				{/* Ringkasan Sticky di Kanan */}
				<div className="lg:col-span-4 lg:sticky lg:top-6">
					<Card variant="hero" padding="lg" className="space-y-5">
						<div className="flex items-center gap-3 pb-3 border-b border-slate-200/70">
							<IconTile icon={PlaySquare} tone="indigo" size="sm" />
							<div>
								<h4 className="text-sm font-bold text-slate-900">
									Ringkasan Konfigurasi
								</h4>
								<p className="text-xs text-slate-500">
									Siap diproyeksikan kapan saja
								</p>
							</div>
						</div>

						<dl className="space-y-3 text-xs">
							<div className="flex items-center justify-between gap-2">
								<dt className="text-slate-500 font-medium">Skenario PHK</dt>
								<dd className="font-semibold text-slate-900 text-right">
									{selectedExitLabel}
								</dd>
							</div>
							<div className="flex items-center justify-between gap-2">
								<dt className="text-slate-500 font-medium">Upah Pokok</dt>
								<dd className="font-semibold text-slate-900 tabular">
									{formatRupiah(
										terms?.monthly_wage_base || termsForm.monthly_wage_base,
									)}
								</dd>
							</div>
							<div className="flex items-center justify-between gap-2">
								<dt className="text-slate-500 font-medium">
									Estimasi Cari Kerja
								</dt>
								<dd className="font-semibold text-indigo-700 tabular">
									{currentSearchMonths} bln
								</dd>
							</div>
							<div className="flex items-center justify-between gap-2">
								<dt className="text-slate-500 font-medium">
									Horizon Evaluasi
								</dt>
								<dd className="font-semibold text-indigo-700 tabular">
									{currentHorizonMonths} bln
								</dd>
							</div>
							<div className="flex items-center justify-between gap-2">
								<dt className="text-slate-500 font-medium">Hak Normatif</dt>
								<dd className="font-semibold text-slate-900">
									{isNormativeCollectable ? "Dapat dicairkan" : "Diabaikan"}
								</dd>
							</div>
							<div className="flex items-center justify-between gap-2">
								<dt className="text-slate-500 font-medium">Target Role</dt>
								<dd className="font-semibold text-slate-900 truncate max-w-[150px]">
									{config.preferred_role_name?.trim() || "Otomatis"}
								</dd>
							</div>
						</dl>

						<PrimaryButton
							size="lg"
							fullWidth
							icon={<PlaySquare size={16} />}
							onClick={() => void handleStart()}
							disabled={savingTerms || termsLoading}>
							{savingTerms ? "Menyimpan Data..." : "Mulai Simulasi"}
						</PrimaryButton>

						<div className="flex items-start gap-2 text-xs text-slate-500">
							<Info size={13} className="shrink-0 mt-0.5 text-indigo-600" />
							<span>
								Simulasi ini bersifat aman dan tidak mengubah data profil
								utamamu.
							</span>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
