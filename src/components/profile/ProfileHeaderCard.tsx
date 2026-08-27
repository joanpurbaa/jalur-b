import { Mail, AtSign } from "lucide-react";
import { personalInfo } from "../../data/dashboardDummyData";
import { SecondaryButton } from "../ui/PrimaryButton";

interface ProfileHeaderCardProps {
	onEdit: () => void;
}

export default function ProfileHeaderCard({ onEdit }: ProfileHeaderCardProps) {
	return (
		<div className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-8 flex flex-col items-center text-center h-full">
			<div className="w-24 h-24 rounded-full overflow-hidden border border-neutral/10 mb-4">
				<img
					src={personalInfo.avatarUrl}
					alt={personalInfo.name}
					className="w-full h-full object-cover"
				/>
			</div>
			<h2 className="text-lg font-bold text-neutral">{personalInfo.name}</h2>
			<p className="text-sm text-neutral/50">{personalInfo.role}</p>

			<div className="w-full mt-5 space-y-2.5 text-left">
				<div className="flex items-center gap-2.5 text-sm text-neutral/70">
					<Mail size={14} className="text-neutral/40" />
					<span>{personalInfo.email}</span>
				</div>
				<div className="flex items-center gap-2.5 text-sm text-neutral/70">
					<AtSign size={14} className="text-neutral/40" />
					<span>{personalInfo.username}</span>
				</div>
			</div>

			<div className="w-full mt-6">
				<SecondaryButton fullWidth onClick={onEdit}>
					Edit Profil
				</SecondaryButton>
			</div>
		</div>
	);
}
