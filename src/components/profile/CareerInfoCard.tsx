import { careerInfo } from "../../data/dashboardDummyData";
import InfoStat from "../ui/InfoStat";
import { SecondaryButton } from "../ui/PrimaryButton";
import Skeleton from "../ui/Skeleton";
import type { OnboardingProfile } from "../../types/onboarding";

interface CareerInfoCardProps {
	onEdit: () => void;
	profile?: OnboardingProfile | null;
	loading?: boolean;
}

function tenureFromMonths(months: number | null): string | null {
	if (months === null || months === undefined) return null;
	if (months < 12) return `${months} bulan`;
	const years = Math.floor(months / 12);
	const rem = months % 12;
	return rem > 0 ? `${years} tahun ${rem} bulan` : `${years} tahun`;
}

export default function CareerInfoCard({
	onEdit,
	profile,
	loading = false,
}: CareerInfoCardProps) {
	const role = profile?.current_role_name || "-";
	const tenure = tenureFromMonths(profile?.work_duration_months ?? null) || "-";

	if (loading) {
		return (
			<div>
				<div className="grid grid-cols-2 gap-y-5 gap-x-6 mb-6">
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i}>
							<Skeleton className="h-3 w-20 mb-2" />
							<Skeleton className="h-5 w-32" />
						</div>
					))}
				</div>
				<Skeleton className="h-10 w-44 rounded-full" />
			</div>
		);
	}

	return (
		<div>
			<div className="grid grid-cols-2 gap-y-5 gap-x-6 mb-6">
				<InfoStat label="Jabatan" value={role} />
				<InfoStat label="Lama Bekerja" value={tenure} />
				<InfoStat label="Career Risk" value={careerInfo.careerRisk} />
				<InfoStat label="AI Exposure" value={careerInfo.aiExposure} />
				<InfoStat label="Skill Relevance" value={careerInfo.skillRelevance} />
			</div>
			<SecondaryButton onClick={onEdit}>Edit Data Karier</SecondaryButton>
		</div>
	);
}