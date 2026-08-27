import { careerInfo } from "../../data/dashboardDummyData";
import InfoStat from "../ui/InfoStat";
import { SecondaryButton } from "../ui/PrimaryButton";

interface CareerInfoCardProps {
	onEdit: () => void;
}

export default function CareerInfoCard({ onEdit }: CareerInfoCardProps) {
	return (
		<div>
			<div className="grid grid-cols-2 gap-y-5 gap-x-6 mb-6">
				<InfoStat label="Jabatan" value={careerInfo.role} />
				<InfoStat label="Lama Bekerja" value={careerInfo.tenure} />
				<InfoStat label="Career Risk" value={careerInfo.careerRisk} />
				<InfoStat label="AI Exposure" value={careerInfo.aiExposure} />
				<InfoStat label="Skill Relevance" value={careerInfo.skillRelevance} />
			</div>
			<SecondaryButton onClick={onEdit}>Edit Data Karier</SecondaryButton>
		</div>
	);
}
