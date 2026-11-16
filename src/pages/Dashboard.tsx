import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layouts/Sidebar";
import { CareerAssessmentProvider } from "../context/CareerAssessmentContext";
import { PageTransition } from "../components/ui/Motion";
import { SkeletonHero, SkeletonStatCard } from "../components/ui/Skeleton";

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

	return (
		<CareerAssessmentProvider>
			<div className="min-h-screen bg-app flex flex-col lg:flex-row font-sans text-slate-900">
				<Sidebar />

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
		</CareerAssessmentProvider>
	);
}
