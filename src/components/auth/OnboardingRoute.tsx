import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface OnboardingRouteProps {
	children: ReactNode;
}

function FullPageLoader() {
	return (
		<div className="min-h-screen bg-app text-slate-900 flex flex-col items-center justify-center p-4 font-sans">
			<div className="bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-xs flex items-center gap-2.5">
				<span className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
				<p className="text-sm font-medium text-slate-600">Memuat...</p>
			</div>
		</div>
	);
}

/**
 * Guards /onboarding:
 * - unauthenticated -> /login
 * - authenticated + onboarding complete -> /dashboard (no re-onboarding)
 * - authenticated + onboarding incomplete -> allow
 */
export default function OnboardingRoute({ children }: OnboardingRouteProps) {
	const { status, isOnboardingComplete } = useAuth();

	if (status === "loading") {
		return <FullPageLoader />;
	}

	if (status === "unauthenticated") {
		return <Navigate to="/login" replace />;
	}

	if (status === "authenticated" && isOnboardingComplete()) {
		return <Navigate to="/dashboard" replace />;
	}

	return <>{children}</>;
}
