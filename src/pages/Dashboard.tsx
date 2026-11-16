import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layouts/Sidebar";
import { CareerAssessmentProvider } from "../context/CareerAssessmentContext";
import { moduleFromPath } from "../lib/modules";
import { PageTransition } from "../components/ui/Motion";

export default function Dashboard() {
	const location = useLocation();
	const currentModule = moduleFromPath(location.pathname);

	return (
		<CareerAssessmentProvider>
			<div
				data-module={currentModule}
				className="min-h-screen bg-mesh bg-noise flex flex-col lg:flex-row font-sans text-neutral">
				<Sidebar />

				<main className="flex-1 min-w-0 px-4 pt-5 pb-28 sm:px-8 sm:pt-8 lg:px-10 lg:py-9 overflow-x-hidden">
					<div className="mx-auto max-w-6xl">
						<PageTransition routeKey={location.pathname}>
							<Outlet />
						</PageTransition>
					</div>
				</main>
			</div>
		</CareerAssessmentProvider>
	);
}
