import { Suspense } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layouts/Sidebar";
import { CareerAssessmentProvider } from "../context/CareerAssessmentContext";
import { PageTransition } from "../components/ui/Motion";
import { SkeletonHero, SkeletonStatCard } from "../components/ui/Skeleton";
import CreditChip from "../components/ui/CreditChip";
import DemoCacheControl from "../components/ui/DemoCacheControl";
import { MODULES, moduleFromPath } from "../lib/modules";

function DashboardOutletFallback() {
	return (
		<div className="space-y-6">
			<SkeletonHero />
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<SkeletonStatCard />
				<SkeletonStatCard />
				<SkeletonStatCard />
				<SkeletonStatCard />
			</div>
		</div>
	);
}

export default function Dashboard() {
	const location = useLocation();
	const currentModule = MODULES[moduleFromPath(location.pathname)];
	const ModuleIcon = currentModule.icon;

	return (
		<CareerAssessmentProvider>
			<div className="min-h-screen bg-app flex flex-col lg:flex-row font-sans text-slate-900">
				<Sidebar />

				<div className="flex-1 min-w-0 flex flex-col">
					{/* Top utility bar: konteks modul & chip saldo B-Credits */}
					<div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 lg:px-10 h-14 flex items-center justify-between gap-3">
						<div className="flex items-center gap-2.5 min-w-0">
							<Link
								to="/dashboard/beranda"
								className="lg:hidden flex items-center gap-2 shrink-0">
								<img
									src="/icon.png"
									alt="Logo Jalur B"
									className="w-7 h-7 rounded-lg object-contain"
								/>
							</Link>
							<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 truncate">
								<ModuleIcon
									size={15}
									className="text-indigo-600 shrink-0"
									strokeWidth={2}
								/>
								<span className="truncate">{currentModule.label}</span>
							</span>
						</div>

						<div className="flex items-center gap-2 shrink-0">
							<DemoCacheControl />
							<CreditChip />
						</div>
					</div>

					<main className="flex-1 min-w-0 px-4 pt-5 pb-28 sm:px-8 sm:pt-7 lg:px-10 lg:py-8 overflow-x-hidden">
						<div className="mx-auto max-w-6xl">
							<Suspense fallback={<DashboardOutletFallback />}>
								<PageTransition routeKey={location.pathname}>
									<Outlet />
								</PageTransition>
							</Suspense>
						</div>
					</main>
				</div>
			</div>
		</CareerAssessmentProvider>
	);
}
