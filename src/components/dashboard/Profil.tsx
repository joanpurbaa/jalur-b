import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../layouts/PageHeader";
import ProfileHeaderCard from "../profile/ProfileHeaderCard";
import CareerSummaryCard from "../profile/CareerSummaryCard";
import ProfileSection from "../profile/ProfileSection";
import CareerInfoCard from "../profile/CareerInfoCard";
import RiskSummaryCard from "../profile/RiskSummaryCard";
import SkillSummaryCard from "../profile/SkillSummaryCard";
import CareerPathSummaryCard from "../profile/CareerPathSummaryCard";
import EvidenceSummaryCard from "../profile/EvidenceSummaryCard";
import FinancialSummaryCard from "../profile/FinancialSummaryCard";
import SimulationSummaryCard from "../profile/SimulationSummaryCard";
import { EditProfileModal } from "../profile/EditProfileModal";
import { EditCareerModal } from "../profile/EditCareerModal";
import { EditFinancialModal } from "../profile/EditFinancialModal";

export default function Profil() {
	const navigate = useNavigate();
	const [editProfileOpen, setEditProfileOpen] = useState(false);
	const [editCareerOpen, setEditCareerOpen] = useState(false);
	const [editFinancialOpen, setEditFinancialOpen] = useState(false);

	return (
		<div>
			<PageHeader
				title="Profil"
				subtitle="Kelola informasi diri dan data yang digunakan Jalur B untuk memahami kondisi kariermu."
			/>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-stretch">
				<ProfileHeaderCard onEdit={() => setEditProfileOpen(true)} />
				<div className="lg:col-span-2">
					<ProfileSection title="Ringkasan Karier">
						<CareerSummaryCard />
					</ProfileSection>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<ProfileSection title="Informasi Karier">
					<CareerInfoCard onEdit={() => setEditCareerOpen(true)} />
				</ProfileSection>

				<ProfileSection title="Profil Risiko Karier">
					<RiskSummaryCard onSeeMore={() => navigate("/dashboard/risiko-karier")} />
				</ProfileSection>

				<ProfileSection title="Skill & AI">
					<SkillSummaryCard onSeeMore={() => navigate("/dashboard/skill")} />
				</ProfileSection>

				<ProfileSection title="Jalur Karier">
					<CareerPathSummaryCard onSeeMore={() => navigate("/dashboard/jalur-karier")} />
				</ProfileSection>

				<ProfileSection title="Bukti Karier">
					<EvidenceSummaryCard onSeeMore={() => navigate("/dashboard/bukti-karier")} />
				</ProfileSection>

				<ProfileSection title="Informasi Finansial">
					<FinancialSummaryCard onEdit={() => setEditFinancialOpen(true)} />
				</ProfileSection>

				<div className="lg:col-span-2">
					<ProfileSection title="Data Simulasi">
						<SimulationSummaryCard
							onSeeMore={() => navigate("/dashboard/simulasi")}
						/>
					</ProfileSection>
				</div>
			</div>

			<EditProfileModal
				open={editProfileOpen}
				onClose={() => setEditProfileOpen(false)}
			/>
			<EditCareerModal
				open={editCareerOpen}
				onClose={() => setEditCareerOpen(false)}
			/>
			<EditFinancialModal
				open={editFinancialOpen}
				onClose={() => setEditFinancialOpen(false)}
			/>
		</div>
	);
}
