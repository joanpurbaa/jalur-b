import { useState } from "react";
import {
	Briefcase,
	CheckCircle2,
	Circle,
	Clock,
	Coins,
	Database,
	Gift,
	Lock,
	RefreshCw,
	RotateCcw,
	Trash2,
} from "lucide-react";
import Modal from "./Modal";
import IconTile from "./IconTile";
import { PrimaryButton, SecondaryButton } from "./PrimaryButton";
import { useCredits } from "../../context/CreditsContext";
import { clearUserCache } from "../../services/http";
import {
	clearAllManualCache,
	getManualCacheSummary,
	removeManualCache,
	type ManualCacheSummaryItem,
} from "../../lib/manualCache";

function formatTimeShort(iso: string | null): string {
	if (!iso) return "";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "";
	return d.toLocaleTimeString("id-ID", {
		hour: "2-digit",
		minute: "2-digit",
	});
}

export default function DemoCacheControl() {
	const {
		balance,
		unlockedCount,
		trialGranted,
		addMockCredits,
		resetCreditsDemo,
		activateTrialDemo,
		relockAllFeatures,
		employmentStatus,
		setEmploymentStatus,
	} = useCredits();

	const [open, setOpen] = useState(false);
	const [justResetToken, setJustResetToken] = useState(false);
	const [summary, setSummary] = useState<{
		items: ManualCacheSummaryItem[];
		httpCacheCount: number;
	}>(() => getManualCacheSummary());
	const [feedback, setFeedback] = useState<string | null>(null);

	const handleQuickResetToken = () => {
		resetCreditsDemo();
		setJustResetToken(true);
		setTimeout(() => setJustResetToken(false), 1800);
	};

	const refreshSummary = () => {
		setSummary(getManualCacheSummary());
	};

	const handleOpen = () => {
		refreshSummary();
		setFeedback(null);
		setOpen(true);
	};

	const notify = (msg: string) => {
		setFeedback(msg);
		refreshSummary();
	};

	const handleClearSimulationOnly = () => {
		removeManualCache("simulation_last");
		notify("Cache hasil simulasi terakhir dihapus.");
	};

	const handleClearAllAndReload = () => {
		clearAllManualCache();
		clearUserCache();
		setOpen(false);
		window.location.reload();
	};

	const cachedModuleCount = summary.items.filter((i) => i.cached).length;

	return (
		<>
			<button
				type="button"
				onClick={handleQuickResetToken}
				title="Reset saldo B-Credits ke 0 dan kunci ulang semua kartu"
				className={`press inline-flex items-center gap-1.5 min-h-[36px] px-2.5 sm:px-3 py-1.5 rounded-full border text-xs font-semibold transition cursor-pointer ${
					justResetToken
						? "bg-emerald-50 border-emerald-200 text-emerald-800"
						: "bg-white hover:bg-rose-50 border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-700"
				}`}>
				{justResetToken ? (
					<CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
				) : (
					<RotateCcw size={13} className="shrink-0" />
				)}
				<span className="hidden sm:inline">
					{justResetToken ? "Token 0 · Terkunci" : "Reset Token"}
				</span>
			</button>

			<button
				type="button"
				onClick={handleOpen}
				title="Cache Manual & Reset State Demo"
				className="press inline-flex items-center gap-1.5 min-h-[36px] px-2.5 sm:px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold transition cursor-pointer">
				<Database size={13} className="text-slate-500 shrink-0" />
				<span className="hidden sm:inline">Cache</span>
				{cachedModuleCount > 0 && (
					<span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-slate-100 text-[10px] font-bold text-slate-700 tabular">
						{cachedModuleCount}
					</span>
				)}
			</button>

			<Modal
				open={open}
				onClose={() => setOpen(false)}
				title="Cache Manual & Reset Demo"
				subtitle="Kelola penyimpanan lokal hasil analisis dan atur ulang state B-Credits untuk demo atau pengambilan screenshot."
				maxWidth="max-w-lg">
				<div className="space-y-6">
					{feedback && (
						<div className="rounded-xl border border-emerald-200 bg-emerald-50/80 px-3.5 py-2.5 flex items-center gap-2 text-xs font-semibold text-emerald-900">
							<CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
							<span>{feedback}</span>
						</div>
					)}

					{/* Bagian 1: Cache Hasil Analisis & Simulasi */}
					<section className="space-y-3">
						<div className="flex items-center justify-between gap-2">
							<div className="flex items-center gap-2">
								<IconTile icon={Database} tone="indigo" size="xs" />
								<div>
									<h4 className="text-sm font-bold text-slate-900">
										Cache Hasil Analisis Lokal
									</h4>
									<p className="text-xs text-slate-500">
										{cachedModuleCount} dari {summary.items.length} modul
										tersimpan · {summary.httpCacheCount} entri cache GET API
									</p>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
							{summary.items.map((item) => (
								<div
									key={item.key}
									className={`rounded-xl border px-3 py-2 flex items-center justify-between gap-2 text-xs ${
										item.cached
											? "bg-emerald-50/45 border-emerald-200/80 text-slate-800"
											: "bg-slate-50/70 border-slate-200 text-slate-500"
									}`}>
									<div className="flex items-center gap-2 min-w-0">
										{item.cached ? (
											<CheckCircle2
												size={14}
												className="text-emerald-600 shrink-0"
											/>
										) : (
											<Circle size={14} className="text-slate-300 shrink-0" />
										)}
										<span className="font-semibold truncate">{item.label}</span>
									</div>
									{item.cached && item.savedAt && (
										<span className="text-[11px] text-slate-500 tabular shrink-0">
											{formatTimeShort(item.savedAt)}
										</span>
									)}
								</div>
							))}
						</div>

						<div className="flex flex-col sm:flex-row gap-2 pt-1">
							<SecondaryButton
								size="sm"
								fullWidth
								icon={<Trash2 size={13} />}
								onClick={handleClearSimulationOnly}>
								Hapus Cache Simulasi
							</SecondaryButton>
							<PrimaryButton
								size="sm"
								fullWidth
								icon={<RefreshCw size={13} />}
								onClick={handleClearAllAndReload}>
								Bersihkan Cache &amp; Muat Ulang
							</PrimaryButton>
						</div>
					</section>

					{/* Bagian 2: State Demo B-Credits */}
					<section className="pt-5 border-t border-slate-100 space-y-3">
						<div className="flex items-center justify-between gap-2">
							<div className="flex items-center gap-2">
								<IconTile icon={Coins} tone="indigo" size="xs" />
								<div>
									<h4 className="text-sm font-bold text-slate-900">
										State Demo B-Credits
									</h4>
									<p className="text-xs text-slate-500 tabular">
										Saldo: <strong>{balance} credit</strong> · Fitur terbuka:{" "}
										<strong>{unlockedCount}/6</strong> · Trial:{" "}
										<strong>{trialGranted ? "Aktif" : "Belum"}</strong>
									</p>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
							<button
								type="button"
								onClick={() => {
									resetCreditsDemo();
									notify(
										"B-Credits di-reset ke 0 credit dan semua 6 fitur dikunci ulang.",
									);
								}}
								className="press rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 p-3 text-left transition cursor-pointer flex items-start gap-2.5">
								<RotateCcw
									size={15}
									className="text-indigo-600 shrink-0 mt-0.5"
								/>
								<div>
									<p className="text-xs font-bold text-slate-900">
										Reset Awal (0 credit)
									</p>
									<p className="text-[11px] text-slate-500 mt-0.5">
										Uji modal saldo kurang &amp; banner trial baru
									</p>
								</div>
							</button>

							<button
								type="button"
								onClick={() => {
									activateTrialDemo();
									notify(
										"Mode Trial aktif: 6 credit tersedia dan semua gembok tampil.",
									);
								}}
								className="press rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 p-3 text-left transition cursor-pointer flex items-start gap-2.5">
								<Gift size={15} className="text-indigo-600 shrink-0 mt-0.5" />
								<div>
									<p className="text-xs font-bold text-slate-900">
										Mode Trial (6 credit)
									</p>
									<p className="text-[11px] text-slate-500 mt-0.5">
										Uji modal &ldquo;Pakai X credit&rdquo; + banner trial
									</p>
								</div>
							</button>

							<button
								type="button"
								onClick={() => {
									addMockCredits(10);
									notify("+10 mock B-Credits ditambahkan ke saldo.");
								}}
								className="press rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 p-3 text-left transition cursor-pointer flex items-start gap-2.5">
								<Coins size={15} className="text-indigo-600 shrink-0 mt-0.5" />
								<div>
									<p className="text-xs font-bold text-slate-900">
										Tambah +10 Credit
									</p>
									<p className="text-[11px] text-slate-500 mt-0.5">
										Top-up simulasi tanpa transaksi sungguhan
									</p>
								</div>
							</button>

							<button
								type="button"
								onClick={() => {
									relockAllFeatures();
									notify(
										"Seluruh 6 titik kunci fitur B-Credits dikunci kembali (saldo tetap).",
									);
								}}
								className="press rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 p-3 text-left transition cursor-pointer flex items-start gap-2.5">
								<Lock size={15} className="text-indigo-600 shrink-0 mt-0.5" />
								<div>
									<p className="text-xs font-bold text-slate-900">
										Kunci Ulang 6 Fitur
									</p>
									<p className="text-[11px] text-slate-500 mt-0.5">
										Tampilkan kembali gembok tanpa ubah saldo
									</p>
								</div>
							</button>
						</div>
					</section>

					{/* Bagian 3: Toggle Cepat Status Kerja (JKP) */}
					<section className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
						<div className="flex items-start gap-2.5">
							<IconTile
								icon={employmentStatus === "stopped" ? Clock : Briefcase}
								tone={employmentStatus === "stopped" ? "caution" : "indigo"}
								size="xs"
							/>
							<div>
								<h4 className="text-xs font-bold text-slate-900">
									Status Kerja (Demo Tenggat JKP)
								</h4>
								<p className="text-[11px] text-slate-500 mt-0.5">
									Ubah ke <em>Sudah berhenti</em> untuk menonjolkan banner klaim
									JKP di Simulasi.
								</p>
							</div>
						</div>

						<div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 shrink-0 self-start sm:self-center">
							<button
								type="button"
								onClick={() => {
									setEmploymentStatus("working");
									notify("Status diubah ke Sedang bekerja.");
								}}
								className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
									employmentStatus !== "stopped"
										? "bg-white text-indigo-700 shadow-2xs"
										: "text-slate-600 hover:text-slate-900"
								}`}>
								Sedang bekerja
							</button>
							<button
								type="button"
								onClick={() => {
									setEmploymentStatus("stopped");
									notify(
										"Status diubah ke Sudah berhenti — banner tenggat JKP aktif di Simulasi.",
									);
								}}
								className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
									employmentStatus === "stopped"
										? "bg-indigo-600 text-white shadow-2xs"
										: "text-slate-600 hover:text-slate-900"
								}`}>
								Sudah berhenti
							</button>
						</div>
					</section>
				</div>
			</Modal>
		</>
	);
}
