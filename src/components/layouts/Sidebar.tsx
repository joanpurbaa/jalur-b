import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	ChevronLeft,
	ChevronRight,
	LogOut,
	MoreHorizontal,
	Sparkles,
	User,
	X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";
import { MODULES, moduleFromPath, type ModuleId } from "../../lib/modules";
import IconTile from "../ui/IconTile";
import ScoreRing from "../ui/ScoreRing";
import { dashboardApi } from "../../services/dashboard";
import { careerHealthApi } from "../../services/careerHealth";
import { parseDecimal } from "../../lib/parseNumeric";

const PANTAU_ITEMS: ModuleId[] = [
	"beranda",
	"kesehatan-karier",
	"risiko-karier",
	"skill",
];

const BERTINDAK_ITEMS: ModuleId[] = [
	"jalur-karier",
	"bukti-karier",
	"finansial",
	"simulasi",
];

const MOBILE_PRIMARY_ITEMS: ModuleId[] = [
	"beranda",
	"kesehatan-karier",
	"skill",
	"finansial",
	"simulasi",
];

export default function Sidebar() {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
	const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
	const [completeness, setCompleteness] = useState<number>(75);
	const [missingLabel, setMissingLabel] = useState<string>(
		"Penilaian karier belum lengkap",
	);

	const location = useLocation();
	const navigate = useNavigate();
	const { logout } = useAuth();
	const { openCareerAssessment, refreshKey } = useCareerAssessment();

	const currentPath = moduleFromPath(location.pathname);

	useEffect(() => {
		let active = true;
		const checkCompleteness = async () => {
			const [dashRes, healthRes] = await Promise.allSettled([
				dashboardApi.get(),
				careerHealthApi.latest(),
			]);
			if (!active) return;

			let done = 0;
			let nextMissing = "";

			const dash = dashRes.status === "fulfilled" ? dashRes.value : null;
			const hasProfile = Boolean(
				dash?.onboarding_completed || dash?.profile?.full_name,
			);
			const hasHealth = healthRes.status === "fulfilled" && Boolean(healthRes.value);
			const hasEvidence = Boolean(dash && dash.evidence.total > 0);
			const hasFinancial = Boolean(
				dash?.financial && parseDecimal(dash.financial.runway_months) > 0,
			);

			if (hasProfile) done += 25;
			else if (!nextMissing) nextMissing = "Lengkapi profil dasar";

			if (hasHealth) done += 25;
			else if (!nextMissing) nextMissing = "Isi penilaian karier";

			if (hasEvidence) done += 25;
			else if (!nextMissing) nextMissing = "Simpan bukti karier";

			if (hasFinancial) done += 25;
			else if (!nextMissing) nextMissing = "Atur parameter finansial";

			setCompleteness(done);
			setMissingLabel(nextMissing || "Semua data sudah lengkap");
		};
		void checkCompleteness();
		return () => {
			active = false;
		};
	}, [refreshKey, location.pathname]);

	const handleNavigation = (id: string) => {
		setIsMobileMoreOpen(false);
		if (id === "keluar") {
			setIsLogoutModalOpen(true);
			return;
		}
		navigate(`/dashboard/${id}`);
	};

	const handleLogout = async () => {
		setIsLogoutModalOpen(false);
		setIsMobileMoreOpen(false);
		await logout();
		navigate("/login");
	};

	const renderNavButton = (id: ModuleId) => {
		const mod = MODULES[id];
		const Icon = mod.icon;
		const isActive = currentPath === id;
		return (
			<button
				key={id}
				type="button"
				onClick={() => handleNavigation(id)}
				title={isCollapsed ? mod.label : undefined}
				className={`press group w-full flex items-center gap-3 px-2.5 py-2 rounded-2xl text-sm font-semibold transition cursor-pointer ${
					isCollapsed ? "justify-center" : ""
				} ${
					isActive
						? `${mod.activePill} shadow-md`
						: "text-neutral/75 hover:bg-slate-900/[0.04] hover:text-neutral"
				}`}>
				{isActive ? (
					<span className="inline-flex w-7 h-7 items-center justify-center rounded-[9px] bg-white/20 text-white shrink-0">
						<Icon size={16} strokeWidth={2.4} />
					</span>
				) : (
					<IconTile icon={Icon} tone={id} size="xs" />
				)}
				{!isCollapsed && <span className="truncate">{mod.label}</span>}
			</button>
		);
	};

	return (
		<>
			{/* Desktop Sidebar */}
			<aside
				aria-label="Navigasi utama"
				className={`hidden lg:flex sticky top-0 h-screen bg-white/80 backdrop-blur-xl border-r border-white/80 shadow-[4px_0_24px_-12px_rgba(30,27,75,0.1)] flex-col justify-between transition-all duration-300 p-4 shrink-0 z-30 ${
					isCollapsed ? "w-20" : "w-68"
				}`}>
				<button
					type="button"
					onClick={() => setIsCollapsed(!isCollapsed)}
					aria-label={isCollapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
					className="absolute -right-3 top-7 bg-white border border-slate-200 rounded-full p-1.5 text-neutral/60 hover:text-primary shadow-sm transition z-40 cursor-pointer">
					{isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
				</button>

				<div className="flex flex-col min-h-0">
					<button
						type="button"
						onClick={() => handleNavigation("beranda")}
						className={`flex items-center gap-3 px-2 py-2.5 mb-5 shrink-0 text-left cursor-pointer ${
							isCollapsed ? "justify-center" : ""
						}`}>
						<img
							src="/icon.png"
							className="w-10 h-10 rounded-2xl shadow-sm shrink-0"
							alt="Logo Jalur B"
						/>
						{!isCollapsed && (
							<div>
								<h2 className="font-extrabold text-neutral text-base leading-tight tracking-tight">
									Jalur B
								</h2>
								<p className="text-xs text-neutral/55 font-medium">
									Career Resilience
								</p>
							</div>
						)}
					</button>

					<nav className="space-y-5 overflow-y-auto no-scrollbar pr-0.5">
						<div>
							{!isCollapsed && (
								<p className="px-2.5 mb-2 text-[11px] font-bold uppercase tracking-wider text-neutral/45">
									Pantau
								</p>
							)}
							<div className="space-y-1">{PANTAU_ITEMS.map(renderNavButton)}</div>
						</div>

						<div>
							{!isCollapsed && (
								<p className="px-2.5 mb-2 text-[11px] font-bold uppercase tracking-wider text-neutral/45">
									Bertindak
								</p>
							)}
							<div className="space-y-1">
								{BERTINDAK_ITEMS.map(renderNavButton)}
							</div>
						</div>
					</nav>
				</div>

				<div className="space-y-3 pt-4 border-t border-slate-200/70 shrink-0">
					{completeness < 100 && (
						<button
							type="button"
							onClick={openCareerAssessment}
							title={
								isCollapsed
									? `Kelengkapan data ${completeness}% — klik untuk melengkapi`
									: undefined
							}
							className={`press w-full rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/90 via-white to-violet-50/90 p-2.5 text-left shadow-xs hover:border-indigo-300 transition cursor-pointer flex items-center gap-3 ${
								isCollapsed ? "justify-center" : ""
							}`}>
							<ScoreRing
								value={completeness}
								max={100}
								size={42}
								stroke={5}
								colors={["#6366f1", "#a855f7"]}>
								<span className="text-[11px] font-extrabold text-indigo-700 tabular">
									{completeness}%
								</span>
							</ScoreRing>
							{!isCollapsed && (
								<div className="min-w-0 flex-1">
									<div className="flex items-center gap-1 text-xs font-bold text-indigo-950">
										<Sparkles size={12} className="text-indigo-600 shrink-0" />
										<span className="truncate">Kelengkapan Data</span>
									</div>
									<p className="text-[11px] text-neutral/60 truncate mt-0.5">
										{missingLabel}
									</p>
								</div>
							)}
						</button>
					)}

					<div className="space-y-1">
						<button
							type="button"
							onClick={() => handleNavigation("profil")}
							title={isCollapsed ? "Profil" : undefined}
							className={`press w-full flex items-center gap-3 px-2.5 py-2 rounded-2xl text-sm font-semibold transition cursor-pointer ${
								isCollapsed ? "justify-center" : ""
							} ${
								currentPath === "profil"
									? `${MODULES.profil.activePill} shadow-md`
									: "text-neutral/75 hover:bg-slate-900/[0.04] hover:text-neutral"
							}`}>
							{currentPath === "profil" ? (
								<span className="inline-flex w-7 h-7 items-center justify-center rounded-[9px] bg-white/20 text-white shrink-0">
									<User size={16} strokeWidth={2.4} />
								</span>
							) : (
								<IconTile icon={User} tone="profil" size="xs" />
							)}
							{!isCollapsed && <span>Profil</span>}
						</button>

						<button
							type="button"
							onClick={() => handleNavigation("keluar")}
							title={isCollapsed ? "Keluar" : undefined}
							className={`press w-full flex items-center gap-3 px-2.5 py-2 rounded-2xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer ${
								isCollapsed ? "justify-center" : ""
							}`}>
							<IconTile icon={LogOut} tone="danger" size="xs" />
							{!isCollapsed && <span>Keluar</span>}
						</button>
					</div>
				</div>
			</aside>

			{/* Mobile Bottom Navigation (5 item + Lainnya) */}
			<nav
				aria-label="Navigasi bawah"
				className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-8px_24px_-12px_rgba(15,23,42,0.16)] px-1.5 py-1.5">
				<div className="grid grid-cols-6 gap-0.5 max-w-md mx-auto">
					{MOBILE_PRIMARY_ITEMS.map((id) => {
						const mod = MODULES[id];
						const Icon = mod.icon;
						const isActive = currentPath === id && !isMobileMoreOpen;
						return (
							<button
								key={id}
								type="button"
								onClick={() => handleNavigation(id)}
								className={`press flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition cursor-pointer ${
									isActive ? mod.text : "text-neutral/55"
								}`}>
								<span
									className={`inline-flex items-center justify-center w-8 h-8 rounded-xl transition ${
										isActive ? `${mod.gradient} text-white shadow-sm` : ""
									}`}>
									<Icon size={17} strokeWidth={2.3} />
								</span>
								<span className="text-[10px] font-bold mt-0.5 truncate max-w-full">
									{mod.shortLabel}
								</span>
							</button>
						);
					})}

					<button
						type="button"
						onClick={() => setIsMobileMoreOpen(true)}
						className={`press flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition cursor-pointer ${
							isMobileMoreOpen ? "text-indigo-600" : "text-neutral/55"
						}`}>
						<span
							className={`inline-flex items-center justify-center w-8 h-8 rounded-xl ${
								isMobileMoreOpen ? "bg-indigo-600 text-white" : ""
							}`}>
							<MoreHorizontal size={18} strokeWidth={2.3} />
						</span>
						<span className="text-[10px] font-bold mt-0.5">Lainnya</span>
					</button>
				</div>
			</nav>

			{/* Mobile Drawer "Lainnya" */}
			{isMobileMoreOpen && (
				<div
					role="dialog"
					aria-modal="true"
					aria-label="Menu lainnya"
					className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
					<div
						className="absolute inset-0 bg-slate-950/45 backdrop-blur-xs"
						onClick={() => setIsMobileMoreOpen(false)}
					/>
					<div className="relative z-10 bg-white rounded-t-3xl p-5 shadow-2xl border-t border-slate-100 max-h-[85vh] overflow-y-auto">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-2.5">
								<img src="/icon.png" className="w-8 h-8 rounded-xl" alt="" />
								<div>
									<p className="font-extrabold text-sm text-neutral">
										Menu Jalur B
									</p>
									<p className="text-xs text-neutral/55">
										Pilih modul yang ingin kamu buka
									</p>
								</div>
							</div>
							<button
								type="button"
								onClick={() => setIsMobileMoreOpen(false)}
								aria-label="Tutup menu"
								className="p-2 rounded-xl text-neutral/50 hover:text-neutral hover:bg-slate-100">
								<X size={18} />
							</button>
						</div>

						{completeness < 100 && (
							<button
								type="button"
								onClick={() => {
									setIsMobileMoreOpen(false);
									openCareerAssessment();
								}}
								className="w-full mb-4 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-3 flex items-center gap-3 text-left">
								<ScoreRing
									value={completeness}
									size={44}
									stroke={5}
									colors={["#6366f1", "#a855f7"]}>
									<span className="text-[11px] font-extrabold text-indigo-700">
										{completeness}%
									</span>
								</ScoreRing>
								<div className="min-w-0 flex-1">
									<p className="text-xs font-bold text-indigo-950">
										Kelengkapan Data Karier
									</p>
									<p className="text-xs text-neutral/65 truncate">
										{missingLabel} — ketuk untuk melengkapi
									</p>
								</div>
							</button>
						)}

						<p className="text-[11px] font-bold uppercase tracking-wider text-neutral/45 mb-2">
							Pantau & Bertindak
						</p>
						<div className="grid grid-cols-2 gap-2 mb-4">
							{[...PANTAU_ITEMS, ...BERTINDAK_ITEMS].map((id) => {
								const mod = MODULES[id];
								const isActive = currentPath === id;
								return (
									<button
										key={id}
										type="button"
										onClick={() => handleNavigation(id)}
										className={`press flex items-center gap-2.5 p-2.5 rounded-2xl border text-left text-xs font-bold ${
											isActive
												? `${mod.tint} ${mod.border} ${mod.text}`
												: "border-slate-200/80 text-neutral hover:bg-slate-50"
										}`}>
										<IconTile icon={mod.icon} tone={id} size="xs" />
										<span className="truncate">{mod.label}</span>
									</button>
								);
							})}
						</div>

						<div className="flex items-center gap-2 pt-3 border-t border-slate-100">
							<button
								type="button"
								onClick={() => handleNavigation("profil")}
								className="press flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border border-slate-200 text-xs font-bold text-neutral">
								<User size={15} />
								Profil Saya
							</button>
							<button
								type="button"
								onClick={() => handleNavigation("keluar")}
								className="press flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold">
								<LogOut size={15} />
								Keluar
							</button>
						</div>
					</div>
				</div>
			)}

			{isLogoutModalOpen && (
				<div
					role="dialog"
					aria-modal="true"
					aria-label="Konfirmasi keluar"
					className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-xs"
					onClick={() => setIsLogoutModalOpen(false)}>
					<div
						className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/80"
						onClick={(e) => e.stopPropagation()}>
						<div className="flex items-start justify-between mb-4">
							<div className="flex items-center gap-3">
								<IconTile icon={LogOut} tone="danger" size="md" />
								<div>
									<h2 className="text-lg font-bold text-neutral">
										Keluar dari Jalur B?
									</h2>
									<p className="text-sm text-neutral/60 mt-0.5">
										Kamu akan diarahkan ke halaman login.
									</p>
								</div>
							</div>
							<button
								type="button"
								onClick={() => setIsLogoutModalOpen(false)}
								className="text-neutral/40 hover:text-neutral transition cursor-pointer">
								<X size={18} />
							</button>
						</div>

						<div className="flex items-center justify-end gap-3 mt-6">
							<button
								type="button"
								onClick={() => setIsLogoutModalOpen(false)}
								className="press px-5 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 text-neutral hover:bg-slate-50 transition cursor-pointer">
								Batal
							</button>
							<button
								type="button"
								onClick={handleLogout}
								className="press px-5 py-2.5 bg-rose-600 text-white text-sm font-semibold rounded-xl hover:bg-rose-700 transition shadow-sm cursor-pointer">
								Ya, Keluar
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
