import { useEffect, useState } from "react";
import PageHeader from "../layouts/PageHeader";
import CareerHealthCard from "./CareerHealthCard";
import CareerSnapshotGrid from "./CareerSnapshotGrid";
import WeeklyFocusAndMission from "./WeeklyFocusAndMission";
import { dashboardApi } from "../../services/dashboard";
import { onboardingApi } from "../../services/onboarding";
import { useAuth } from "../../context/AuthContext";
import { capitalizeName, greetingForTime } from "../../lib/format";

export default function BerandaView() {
	const { user } = useAuth();
	const [rawName, setRawName] = useState<string | null>(null);
	const [roleSummary, setRoleSummary] = useState<string | null>(null);

	useEffect(() => {
		let active = true;
		const loadName = async () => {
			try {
				const res = await dashboardApi.get();
				if (!active) return;
				if (res.profile?.full_name) {
					setRawName(res.profile.full_name);
					if (res.profile.current_role_name) {
						setRoleSummary(
							res.profile.industry_name
								? `${res.profile.current_role_name} · ${res.profile.industry_name}`
								: res.profile.current_role_name,
						);
					}
					return;
				}
				const ob = await onboardingApi.get().catch(() => null);
				if (!active) return;
				if (ob?.profile?.full_name) {
					setRawName(ob.profile.full_name);
					return;
				}
				setRawName(res.account.username || null);
			} catch {
				// fallback ke data auth user tanpa menggagalkan halaman
			}
		};
		void loadName();
		return () => {
			active = false;
		};
	}, []);

	const displayName = capitalizeName(rawName || user?.username) || "Teman";
	const greeting = greetingForTime();

	return (
		<div>
			<PageHeader
				eyebrow={roleSummary ?? undefined}
				title={`${greeting}, ${displayName}`}
				subtitle="Ringkasan kondisi karier, finansial, dan langkah berikutnya minggu ini."
			/>
			<CareerHealthCard />
			<CareerSnapshotGrid />
			<WeeklyFocusAndMission />
		</div>
	);
}
