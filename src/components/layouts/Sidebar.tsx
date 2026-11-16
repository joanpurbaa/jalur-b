import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	ChevronLeft,
	ChevronRight,
	LogOut,
	MoreHorizontal,
	User,
	X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";
import { MODULES, moduleFromPath, type ModuleId } from "../../lib/modules";
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
	const [completeness, setCompleteness] = useState<number>(100);
	const [missingLabel, setMissingLabel] = useState<string>(
		"Semua modul profil sudah terisi",
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
				aria-current={isActive ? "page" : undefined}
				title={isCollapsed ? mod.label : undefined}
				className={`relative w-full min-h-[42px] flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
					isCollapsed ? "justify-center" : ""
				} ${
					isActive
						? "bg-indigo-50 text-indigo-700 font-semibold"
						: "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
				}`}>
				{isActive && !isCollapsed && (
					<span
						aria-hidden
						className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-indigo-600"
					/>
				)}
				<Icon
					size={18}
					strokeWidth={isActive ? 2.1 : 1.75}
					className={isActive ? "text-indigo-600 shrink-0" : "text-slate-500 shrink-0"}
				/>
				{!isCollapsed && <span className="truncate">{mod.label}</span>}
			</button>
		);
	};

	return (
		<>
			{/* Desktop Sidebar */}
			<aside
				aria-label="Navigasi utama"
				className={`hidden lg:flex sticky top-0 h-screen bg-white border-r border-slate-200/80 flex-col justify-between transition-all duration-200 p-4 shrink-0 z-30 ${
					isCollapsed ? "w-20" : "w-64"
				}`}>
				<button
					type="button"
					onClick={() => setIsCollapsed(!isCollapsed)}
					aria-label={isCollapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
					className="absolute -right-3 top-7 bg-white border border-slate-200 rounded-full p-1 text-slate-500 hover:text-indigo-600 hover:border-slate-300 shadow-2xs transition z-40 cursor-pointer">
					{isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
				</button>

				<div className="flex flex-col min-h-0">
					<button
						type="button"
						onClick={() => handleNavigation("beranda")}
						className={`flex items-center gap-3 px-2 py-2 mb-6 shrink-0 text-left cursor-pointer rounded-xl ${
							isCollapsed ? "justify-center" : ""
						}`}>
						<img
							src="/icon.png"
							className="w-8 h-8 rounded-xl shrink-0 object-contain"
							alt="Logo Jalur B"
						/>
						{!isCollapsed && (
							<div>
								<h2 className="font-bold text-slate-900 text-base leading-tight tracking-tight">
									Jalur B
								</h2>
								<p className="text-xs text-slate-500">Career Resilience</p>
							</div>
						)}
					</button>

					<nav className="space-y-5 overflow-y-auto no-scrollbar">
						<div>
							{!isCollapsed && (
								<p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
									Pantau
								</p>
							)}
							<div className="space-y-1">{PANTAU_ITEMS.map(renderNavButton)}</div>
						</div>

						<div>
							{!isCollapsed && (
								<p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
									Bertindak
								</p>
							)}
							<div className="space-y-1">
								{BERTINDAK_ITEMS.map(renderNavButton)}
							</div>
						</div>
					</nav>
				</div>

				<div className="space-y-3 pt-4 border-t border-slate-200/80 shrink-0">
					{completeness < 100 && (
						<button
							type="button"
							onClick={openCareerAssessment}
							title={
								isCollapsed
									? `Kelengkapan profil ${completeness}% — klik untuk melengkapi`
									: undefined
							}
							className={`press w-full rounded-xl border border-slate-200 bg-slate-50/80 hover:border-indigo-200 hover:bg-indigo-50/40 p-2.5 text-left transition cursor-pointer flex items-center gap-2.5 ${
								isCollapsed ? "justify-center" : ""
							}`}>
							<ScoreRing
								value={completeness}
								max={100}
								size={36}
								stroke={4}
								colors={["#4f46e5", "#6366f1"]}
								ariaLabel={`Kelengkapan profil ${completeness}%`}>
								<span className="text-[11px] font-bold text-indigo-700 tabular">
									{completeness}%
								</span>
							</ScoreRing>
							{!isCollapsed && (
								<div className="min-w-0 flex-1">
									<span className="text-xs font-semibold text-slate-800 block truncate">
										Kelengkapan profil
									</span>
									<p className="text-[11px] text-slate-500 truncate mt-0.5">
										{missingLabel}
									</p>
								</div>
							)}
						</button>
					)}

					<div className="space-y-1">
						{renderNavButton("profil")}

						<button
							type="button"
							onClick={() => handleNavigation("keluar")}
							title={isCollapsed ? "Keluar" : undefined}
							className={`w-full min-h-[42px] flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 transition cursor-pointer ${
								isCollapsed ? "justify-center" : ""
							}`}>
							<LogOut
								size={18}
								strokeWidth={1.75}
								className="text-slate-500 shrink-0"
							/>
							{!isCollapsed && <span>Keluar</span>}
						</button>
					</div>
				</div>
			</aside>

			{/* Mobile Bottom Navigation (5 item + Lainnya) */}
			<nav
				aria-label="Navigasi bawah"
				className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1">
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
								aria-current={isActive ? "page" : undefined}
								className={`min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition cursor-pointer ${
									isActive
										? "text-indigo-700 bg-indigo-50/90"
										: "text-slate-500 hover:text-slate-900"
								}`}>
								<Icon size={18} strokeWidth={isActive ? 2.1 : 1.75} />
								<span className="text-[11px] font-semibold mt-1 truncate max-w-full">
									{mod.shortLabel}
								</span>
							</button>
						);
					})}

					<button
						type="button"
						onClick={() => setIsMobileMoreOpen(true)}
						className={`min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition cursor-pointer ${
							isMobileMoreOpen
								? "text-indigo-700 bg-indigo-50/90"
								: "text-slate-500 hover:text-slate-900"
						}`}>
						<MoreHorizontal size={18} strokeWidth={1.75} />
						<span className="text-[11px] font-semibold mt-1">Lainnya</span>
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
						className="absolute inset-0 bg-slate-950/40"
						onClick={() => setIsMobileMoreOpen(false)}
					/>
					<div className="relative z-10 bg-white rounded-t-3xl p-5 shadow-2xl border-t border-slate-200 max-h-[85vh] overflow-y-auto">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-2.5">
								<img src="/icon.png" className="w-8 h-8 rounded-xl" alt="" />
								<div>
									<p className="font-bold text-sm text-slate-900">Menu Jalur B</p>
									<p className="text-xs text-slate-500">
										Pilih halaman yang ingin dibuka
									</p>
								</div>
							</div>
							<button
								type="button"
								onClick={() => setIsMobileMoreOpen(false)}
								aria-label="Tutup menu"
								className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100">
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
								className="w-full mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center gap-3 text-left">
								<ScoreRing
									value={completeness}
									size={40}
									stroke={4}
									colors={["#4f46e5", "#6366f1"]}>
									<span className="text-[11px] font-bold text-indigo-700 tabular">
										{completeness}%
									</span>
								</ScoreRing>
								<div className="min-w-0 flex-1">
									<p className="text-xs font-semibold text-slate-900">
										Kelengkapan profil
									</p>
									<p className="text-xs text-slate-500 truncate">
										{missingLabel}
									</p>
								</div>
							</button>
						)}

						<div className="grid grid-cols-2 gap-2 mb-4">
							{[...PANTAU_ITEMS, ...BERTINDAK_ITEMS].map((id) => {
								const mod = MODULES[id];
								const Icon = mod.icon;
								const isActive = currentPath === id;
								return (
									<button
										key={id}
										type="button"
										onClick={() => handleNavigation(id)}
										className={`min-h-[44px] flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left text-xs font-semibold ${
											isActive
												? "bg-indigo-50 border-indigo-200 text-indigo-700"
												: "border-slate-200 text-slate-700 hover:bg-slate-50"
										}`}>
										<Icon
											size={16}
											strokeWidth={1.85}
											className={
												isActive ? "text-indigo-600" : "text-slate-500"
											}
										/>
										<span className="truncate">{mod.label}</span>
									</button>
								);
							})}
						</div>

						<div className="flex items-center gap-2 pt-3 border-t border-slate-100">
							<button
								type="button"
								onClick={() => handleNavigation("profil")}
								className="press min-h-[44px] flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
								<User size={15} />
								Profil
							</button>
							<button
								type="button"
								onClick={() => handleNavigation("keluar")}
								className="press min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold">
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
					className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40"
					onClick={() => setIsLogoutModalOpen(false)}>
					<div
						className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-slate-200"
						onClick={(e) => e.stopPropagation()}>
						<div className="flex items-start justify-between mb-4">
							<div>
								<h2 className="text-lg font-bold text-slate-900">
									Keluar dari Jalur B?
								</h2>
								<p className="text-sm text-slate-600 mt-1">
									Kamu akan diarahkan kembali ke halaman login.
								</p>
							</div>
							<button
								type="button"
								onClick={() => setIsLogoutModalOpen(false)}
								aria-label="Tutup dialog"
								className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition cursor-pointer">
								<X size={18} />
							</button>
						</div>

						<div className="flex items-center justify-end gap-3 mt-6">
							<button
								type="button"
								onClick={() => setIsLogoutModalOpen(false)}
								className="press min-h-[42px] px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer">
								Batal
							</button>
							<button
								type="button"
								onClick={handleLogout}
								className="press min-h-[42px] px-4 py-2 bg-rose-600 text-white text-sm font-semibold rounded-xl hover:bg-rose-700 transition cursor-pointer">
								Keluar
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
