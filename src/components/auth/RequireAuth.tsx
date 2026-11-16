import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface RequireAuthProps {
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

export default function RequireAuth({ children }: RequireAuthProps) {
	const { status } = useAuth();
	const location = useLocation();

	if (status === "loading") {
		return <FullPageLoader />;
	}

	if (status === "unauthenticated") {
		return <Navigate to="/login" replace state={{ from: location.pathname }} />;
	}

	return <>{children}</>;
}
