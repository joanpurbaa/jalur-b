import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface GuestOnlyProps {
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
 * Guards /login and /register: authenticated users must NOT see the auth forms.
 * Redirect authenticated users based on onboarding status.
 */
export default function GuestOnly({ children }: GuestOnlyProps) {
	const { status, isOnboardingComplete } = useAuth();

	if (status === "loading") {
		return <FullPageLoader />;
	}

	if (status === "authenticated") {
		return <Navigate to={isOnboardingComplete() ? "/dashboard" : "/onboarding"} replace />;
	}

	return <>{children}</>;
}
