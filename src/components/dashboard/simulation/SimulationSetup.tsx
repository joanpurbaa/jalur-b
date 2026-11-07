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
} from "lucide-react";
import { getScoreStatus } from "../../../lib/status";
import { normalizeRiskLevel } from "../../../lib/status";
import StatusBadge from "../../ui/StatusBadge";
import InfoStat from "../../ui/InfoStat";
import { PrimaryButton } from "../../ui/PrimaryButton";
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
	if (years > 0 && rest > 0) return `${years} tahun ${rest} bulan`;
	if (years > 0) return `${years} tahun`;
	if (rest > 0) return `${rest} bulan`;
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

export default function SimulationSetup({
	config,
	onChangeConfig,
	onStart,
}: SimulationSetupProps) {
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

	const healthVariant = getScoreStatus(conditions.careerHealth ?? 0);

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

	const handleStart = async () => {
		setTermsError(null);

		// Jika employment terms belum ada atau sedang diedit, pastikan tersimpan
		if (!terms || showTermsEditor) {
			const wageNumber = Number(termsForm.monthly_wage_base);
			if (!termsForm.monthly_wage_base || Number.isNaN(wageNumber) || wageNumber <= 0) {
				setTermsError("Upah pokok bulanan wajib diisi dengan nominal yang valid (di atas 0).");
				setShowTermsEditor(true);
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
				return;
			} finally {
				setSavingTerms(false);
			}
		}

		onStart();
	};

	return (
		<div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				<div className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-6">
					<div className="flex items-center gap-3 pb-5 mb-5 border-b border-neutral/10">
						<div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
							<Briefcase size={16} className="text-primary" />
						</div>
						<h3 className="text-sm font-bold text-neutral">Kondisi Karier</h3>
					</div>
					<div className="grid grid-cols-2 gap-y-5 gap-x-6">
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
										label={conditions.careerHealthStatus}
										variant={healthVariant}
									/>
								) : undefined
							}
						/>
						<InfoStat
							label="Career Risk"
							value={conditions.careerRisk ?? "—"}
						/>
						<InfoStat
							label="AI Exposure"
							value={
								conditions.aiExposure != null
									? `${conditions.aiExposure}%`
									: "—"
							}
						/>
						<InfoStat
							label="Skill Relevance"
							value={
								conditions.skillRelevance != null
									? `${conditions.skillRelevance}%`
									: "—"
							}
						/>
					</div>
				</div>

				<div className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-6">
					<div className="flex items-center gap-3 pb-5 mb-5 border-b border-neutral/10">
						<div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
							<Landmark size={16} className="text-primary" />
						</div>
						<h3 className="text-sm font-bold text-neutral">Kondisi Finansial</h3>
					</div>
					<div className="grid grid-cols-2 gap-y-5 gap-x-6 mb-5">
						<InfoStat
							label="Tabungan Darurat (Liquid)"
							value={formatRupiah(conditions.liquidAssets)}
						/>
						<InfoStat
							label="Jumlah Tanggungan"
							value={
								conditions.dependents != null
									? String(conditions.dependents)
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
							tone="risk"
						/>
						<InfoStat
							label="Cicilan"
							value={
								conditions.debtPayment
									? `${formatRupiah(conditions.debtPayment)}/bln`
									: "—"
							}
							tone="risk"
						/>
					</div>
					<div className="bg-neutral/5 rounded-xl p-4 flex items-center justify-between">
						<div>
							<p className="text-[11px] font-semibold text-neutral/50 uppercase tracking-wide">
								Financial Runway Saat Ini
							</p>
							<p className="text-xs text-neutral/50 mt-0.5">
								Tanpa perubahan gaya hidup
							</p>
						</div>
						<p className="text-xl font-bold text-primary">
							{conditions.runwayMonths != null
								? `${conditions.runwayMonths.toFixed(1)} Bulan`
								: "—"}
						</p>
					</div>
				</div>
			</div>

			<div className="bg-primary/5 rounded-2xl border border-primary/20 border-l-4 border-l-primary p-6 sm:p-8 space-y-6">
				<div>
					<h3 className="text-base font-bold text-neutral mb-1">
						Konfigurasi Simulasi & Skenario PHK
					</h3>
					<p className="text-xs sm:text-sm text-neutral/70">
						Pilih jenis pemutusan hubungan kerja dan tentukan asumsi perencanaan
						untuk menghitung ketahanan karier serta hak pesangon sesuai regulasi (PP 35/2021).
					</p>
				</div>

				{/* Ketentuan Kerja / Employment Terms Banner & Form */}
				<div className="bg-white rounded-xl p-5 border border-primary/20 shadow-sm space-y-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<DollarSign size={18} className="text-primary" />
							<h4 className="text-sm font-bold text-neutral">
								Data Ketentuan Kerja (Employment Terms)
							</h4>
						</div>
						{terms && !showTermsEditor && (
							<button
								type="button"
								onClick={() => setShowTermsEditor(true)}
								className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline cursor-pointer">
								<Edit2 size={13} />
								Ubah
							</button>
						)}
					</div>

					{termsLoading ? (
						<p className="text-xs text-neutral/50">Memuat data ketentuan kerja…</p>
					) : terms && !showTermsEditor ? (
						<div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-neutral/70 pt-1">
							<div>
								<span className="text-neutral/50">Gaji Pokok: </span>
								<span className="font-bold text-neutral">
									{formatRupiah(terms.monthly_wage_base)}/bln
								</span>
							</div>
							<div>
								<span className="text-neutral/50">Status: </span>
								<span className="font-semibold text-neutral uppercase">
									{terms.employment_type === "pkwtt"
										? "Tetap (PKWTT)"
										: "Kontrak (PKWT)"}
								</span>
							</div>
							<div>
								<span className="text-neutral/50">Masa Kerja: </span>
								<span className="font-semibold text-neutral">
									{terms.tenure_months != null
										? formatTenure(terms.tenure_months)
										: "—"}
								</span>
							</div>
							<div>
								<span className="text-neutral/50">BPJS Ketenagakerjaan: </span>
								<span className="font-semibold text-neutral">
									{terms.bpjs_tk_active ? "Aktif" : "Tidak"}
								</span>
							</div>
							<div className="inline-flex items-center gap-1 text-emerald-600 font-medium">
								<CheckCircle2 size={14} />
								<span>Lengkap untuk simulasi</span>
							</div>
						</div>
					) : (
						<div className="space-y-4 pt-1">
							{!terms && (
								<div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
									<AlertCircle size={16} className="shrink-0 mt-0.5" />
									<p>
										<strong>Data ketentuan kerja belum terisi.</strong> Jalur B memerlukan
										upah pokok dan status kerja untuk menghitung estimasi uang pesangon,
										kompensasi, dan manfaat JKP sesuai regulasi.
									</p>
								</div>
							)}

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label
										htmlFor="monthly_wage_base"
										className="block text-xs font-semibold text-neutral mb-1">
										Gaji Pokok / Upah Bulanan (Rp) <span className="text-rose-500">*</span>
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
										className="w-full px-3 py-2 bg-neutral/5 border border-neutral/20 rounded-lg text-sm font-semibold text-neutral focus:outline-none focus:border-primary"
									/>
									<p className="text-[11px] text-neutral/50 mt-1">
										Upah pokok + tunjangan tetap yang tercantum di slip gaji/kontrak.
									</p>
								</div>

								<div>
									<label className="block text-xs font-semibold text-neutral mb-1">
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
											className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition cursor-pointer ${
												termsForm.employment_type === "pkwtt"
													? "bg-primary text-white border-primary"
													: "bg-neutral/5 text-neutral/70 border-neutral/20 hover:bg-neutral/10"
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
											className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition cursor-pointer ${
												termsForm.employment_type === "pkwt"
													? "bg-primary text-white border-primary"
													: "bg-neutral/5 text-neutral/70 border-neutral/20 hover:bg-neutral/10"
											}`}>
											Kontrak (PKWT)
										</button>
									</div>
								</div>

								<div>
									<label
										htmlFor="tenure_months"
										className="block text-xs font-semibold text-neutral mb-1">
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
										className="w-full px-3 py-2 bg-neutral/5 border border-neutral/20 rounded-lg text-sm text-neutral focus:outline-none focus:border-primary"
									/>
									<p className="text-[11px] text-neutral/50 mt-1">
										{termsForm.tenure_months
											? formatTenure(Number(termsForm.tenure_months))
											: "—"}
									</p>
								</div>

								<div>
									<label
										htmlFor="unused_leave_days"
										className="block text-xs font-semibold text-neutral mb-1">
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
										className="w-full px-3 py-2 bg-neutral/5 border border-neutral/20 rounded-lg text-sm text-neutral focus:outline-none focus:border-primary"
									/>
									<p className="text-[11px] text-neutral/50 mt-1">
										Dihitung sebagai hak penggantian hak normatif jika belum gugur.
									</p>
								</div>
							</div>

							<div className="flex items-center gap-2 pt-1">
								<button
									type="button"
									onClick={() =>
										setTermsForm((prev) => ({
											...prev,
											bpjs_tk_active: !prev.bpjs_tk_active,
										}))
									}
									className="flex items-center gap-2 text-xs font-medium text-neutral cursor-pointer">
									{termsForm.bpjs_tk_active ? (
										<CheckSquare size={16} className="text-primary" />
									) : (
										<Square size={16} className="text-neutral/40" />
									)}
									<span>Peserta aktif BPJS Ketenagakerjaan (berhak atas program JKP & JHT)</span>
								</button>
							</div>

							{terms && (
								<div className="flex justify-end gap-2 pt-1">
									<button
										type="button"
										onClick={() => setShowTermsEditor(false)}
										className="px-3 py-1.5 text-xs text-neutral/60 hover:text-neutral">
										Batal
									</button>
								</div>
							)}
						</div>
					)}

					{termsError && (
						<p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
							{termsError}
						</p>
					)}
				</div>

				<div>
					<label className="block text-xs font-bold text-neutral/80 uppercase tracking-wider mb-2">
						1. Jenis Pemutusan Hubungan Kerja (Exit Ground)
					</label>
					<ExitTypePicker
						selected={currentExitType}
						options={exitTypeOptions}
						onSelect={(id) => updateConfig("exit_type", id)}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
					<div className="bg-white/80 rounded-xl p-4 border border-neutral/10 space-y-3">
						<div className="flex items-center gap-2">
							<Clock size={16} className="text-primary" />
							<label
								htmlFor="search_time_months"
								className="text-xs font-bold text-neutral">
								Estimasi Waktu Cari Kerja (Bulan)
							</label>
						</div>
						<p className="text-xs text-neutral/60">
							Berapa lama estimasi kamu membutuhkan waktu mencari & mendapatkan
							pekerjaan baru?
						</p>
						<div className="flex items-center gap-3">
							<input
								id="search_time_months"
								type="number"
								min={0}
								max={24}
								value={currentSearchMonths}
								onChange={(e) =>
									updateConfig(
										"search_time_months",
										Math.max(0, Math.min(24, Number(e.target.value) || 0)),
									)
								}
								className="w-24 px-3 py-2 bg-white border border-neutral/20 rounded-lg text-sm font-semibold text-neutral focus:outline-none focus:border-primary"
							/>
							<div className="flex flex-wrap gap-1.5">
								{searchPresetMonths.map((m) => (
									<button
										key={m}
										type="button"
										onClick={() => updateConfig("search_time_months", m)}
										className={`px-2.5 py-1 text-xs rounded-md transition cursor-pointer font-medium ${
											currentSearchMonths === m
												? "bg-primary text-white"
												: "bg-neutral/10 text-neutral/70 hover:bg-neutral/15"
										}`}>
										{m} bln
									</button>
								))}
							</div>
						</div>
					</div>

					<div className="bg-white/80 rounded-xl p-4 border border-neutral/10 space-y-3">
						<div className="flex items-center gap-2">
							<Calendar size={16} className="text-primary" />
							<label
								htmlFor="horizon_months"
								className="text-xs font-bold text-neutral">
								Horizon Perencanaan (Bulan)
							</label>
						</div>
						<p className="text-xs text-neutral/60">
							Rentang waktu evaluasi dan proyeksi ketahanan finansial kamu.
						</p>
						<div className="flex items-center gap-3">
							<input
								id="horizon_months"
								type="number"
								min={1}
								max={60}
								value={currentHorizonMonths}
								onChange={(e) =>
									updateConfig(
										"horizon_months",
										Math.max(1, Math.min(60, Number(e.target.value) || 1)),
									)
								}
								className="w-24 px-3 py-2 bg-white border border-neutral/20 rounded-lg text-sm font-semibold text-neutral focus:outline-none focus:border-primary"
							/>
							<div className="flex flex-wrap gap-1.5">
								{horizonPresetMonths.map((m) => (
									<button
										key={m}
										type="button"
										onClick={() => updateConfig("horizon_months", m)}
										className={`px-2.5 py-1 text-xs rounded-md transition cursor-pointer font-medium ${
											currentHorizonMonths === m
												? "bg-primary text-white"
												: "bg-neutral/10 text-neutral/70 hover:bg-neutral/15"
										}`}>
										{m} bln
									</button>
								))}
							</div>
						</div>
					</div>
				</div>

				<div className="bg-white/80 rounded-xl p-4 border border-neutral/10">
					<button
						type="button"
						onClick={() =>
							updateConfig(
								"normative_rights_collectable",
								!isNormativeCollectable,
							)
						}
						className="flex items-start gap-3 text-left w-full cursor-pointer">
						<div className="mt-0.5 text-primary">
							{isNormativeCollectable ? (
								<CheckSquare size={18} className="text-primary" />
							) : (
								<Square size={18} className="text-neutral/40" />
							)}
						</div>
						<div>
							<p className="text-xs sm:text-sm font-bold text-neutral">
								Hak Normatif Dapat Dicairkan
							</p>
							<p className="text-xs text-neutral/60 mt-0.5">
								Centang jika kamu memiliki hak normatif yang dapat ditagihkan/dicairkan
								(seperti sisa cuti tahunan yang belum gugur atau hak penggantian sesuai
								peraturan).
							</p>
						</div>
					</button>
				</div>

				<div className="bg-white/80 rounded-xl p-4 border border-neutral/10 space-y-2">
					<div className="flex items-center gap-2">
						<Target size={16} className="text-primary" />
						<label
							htmlFor="preferred_role_name"
							className="text-xs font-bold text-neutral">
							Target Role Tujuan (Opsional)
						</label>
					</div>
					<p className="text-xs text-neutral/60">
						Masukkan peran atau posisi yang kamu tuju saat mencari pekerjaan baru untuk
						menilai kecocokan dan gap kesiapan.
					</p>
					<input
						id="preferred_role_name"
						type="text"
						maxLength={100}
						placeholder="contoh: Senior Frontend Engineer, Product Manager"
						value={config.preferred_role_name ?? ""}
						onChange={(e) =>
							updateConfig("preferred_role_name", e.target.value)
						}
						className="w-full px-3 py-2 bg-white border border-neutral/20 rounded-lg text-sm text-neutral focus:outline-none focus:border-primary"
					/>
					{pivotSuggestions.length > 0 && (
						<div className="pt-1">
							<p className="text-[11px] text-neutral/50 mb-1">
								Saran dari analisis pivot kamu:
							</p>
							<div className="flex flex-wrap gap-1.5">
								{pivotSuggestions.map((role) => (
									<button
										key={role}
										type="button"
										onClick={() =>
											updateConfig("preferred_role_name", role)
										}
										className={`px-2.5 py-1 text-xs rounded-full border transition cursor-pointer ${
											config.preferred_role_name === role
												? "border-primary bg-primary/10 text-primary font-semibold"
												: "border-neutral/20 bg-white text-neutral/70 hover:bg-neutral/5"
										}`}>
										+ {role}
									</button>
								))}
							</div>
						</div>
					)}
				</div>

				<div className="flex flex-col items-center pt-2">
					<PrimaryButton
						onClick={handleStart}
						disabled={savingTerms || termsLoading}>
						{savingTerms ? "Menyimpan Data..." : "Mulai Simulasi"}
					</PrimaryButton>
					<div className="flex items-center gap-1.5 mt-3">
						<Info size={12} className="text-neutral/40" />
						<p className="text-xs text-neutral/50">
							Ini hanya simulasi. Data asli profilmu tidak akan diubah.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
